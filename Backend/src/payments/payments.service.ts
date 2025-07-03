import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { RefundDto } from './dto/refund.dto';

import { Transaction } from './transaction.entity';
import { PaymentMethod } from './paymentmethod.entity';
import {transactionStatus} from './transactionstatus.entity';
import { transactionDetail } from './transactionDetail.entity';
import {refund} from './refund.entity';

@Injectable()
export class PaymentsService {
    constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
                @InjectRepository(PaymentMethod) private paymentMethodRepo: Repository<PaymentMethod>,
                @InjectRepository(transactionStatus) private transactionStatusRepo: Repository<transactionStatus>,
                @InjectRepository(transactionDetail) private transactionDetailRepo: Repository<transactionDetail>,
                @InjectRepository(refund) private readonly refundRepo: Repository<refund>) {}


    async findAllPayments(page = 1, limit = 10, userId?: number): Promise<{ data: Transaction[]; total: number }> {
        const whereClause = userId ? { userId } : {};
        const [data, total] = await this.transactionRepo.findAndCount({
    where: whereClause,
    relations: ['transactionDetails', 'transactionDetails.paymentState', 'paymentMethod'],
    skip: (page - 1) * limit,
    take: limit,
  });

    return { data, total };
    }
 
 
    async findPaymentById(id: number, userId: number, isAdmin: boolean) {
        const payment = await this.transactionRepo.findOne({ 
            where: { id },
            relations: ['paymentMethod', 'transactionDetails', 'transactionDetails.paymentState'],
        });
        if (!payment) throw new NotFoundException('Payment not found');
        if (!isAdmin && payment.userId !== userId) {
            throw new BadRequestException('No tienes permiso para ver este pago');
            }
        return payment;
    }

    async findPaymentsByUser(userId: number, page = 1, limit = 10): Promise<{ data: Transaction[]; total: number }> {
        const [data, total] = await this.transactionRepo.findAndCount({
            where: { userId: userId },
            relations: ['transactionDetails', 'transactionDetails.paymentState', 'paymentMethod'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return { data, total };
    }


    async createPayment(data: CreatePaymentDto) {
        // Buscar el método de pago por nombre para almacenar su puntero y tiro una excepcion si no existe
        const paymentMethod = await this.paymentMethodRepo.findOne({
            where: { name: data.method}
        });
        if (!paymentMethod) {
            throw new BadRequestException(`Payment method '${data.method}' not found or inactive`)}

        //Busca si el nombre del estado de pago si existe en la base de datos y sino, tiro una excepcion
        const paymentState = await this.transactionStatusRepo.findOne({
            where: { name: data.transactionDetails.paymentStatus}
        });
        if (!paymentState) {
            throw new BadRequestException(`Payment state '${data.transactionDetails.paymentStatus}' not found`);
        }

        //Debo crear el detalle(patron creador el todo crea a sus partes)
        const transactionDetail = this.transactionDetailRepo.create({
        paymentState: paymentState, 
        });

        //crea finalmente el pago
        const newPayment = this.transactionRepo.create({
            orderId: data.orderId,
            userId: data.userId,
            amount: data.amount,
            paymentMethod: paymentMethod, // Asignar la entidad completa(puntero)
            transactionDetails:transactionDetail , // Asignar el estado de pago
            status: paymentState.name, 
            paymentTime: new Date().toISOString(),
        });
        
        //le pasamso esto al controller y despues el lo formatea
        return this.transactionRepo.save(newPayment);
    }

    async updatePaymentStatus(id: number, dto: UpdateStatusDto, userId: number, isAdmin: boolean) {
        //Primero busco el pago por id
        const payment = await this.findPaymentById(id, userId, isAdmin);
        //luego compruebo que ese estado exista y sino lanza error
        const paymentState = await this.transactionStatusRepo.findOne({
            where: { name: dto.status}
        });
        if (!paymentState) {
            throw new BadRequestException(`Payment state '${dto.status}' not found`);
        }
        //finalmente actualizo ambos estados
        payment.status = dto.status;
        payment.transactionDetails.paymentState = paymentState;
        //Guardo el cambio, NO OLVIDAR EL AWAIT,SINO SE GUARDAN LOS CAMBIOS A LA SIGUIENTE PETICION 
        await this.transactionRepo.save(payment);
        //Devuelvo el objeto actualizado
        return this.findPaymentById(id, userId, isAdmin);
    }

    async refundPayment(id: number, dto: RefundDto, userId: number, isAdmin: boolean) {
        //Primero creo el refund
        const refund = this.refundRepo.create({
            reason: dto.reason,
            refundTime: new Date().toISOString()
        })
        //Ahora cambio el estado de la transaccion a "refunded"
        const refundState = await this.transactionStatusRepo.findOne({
            where: { name: 'refunded' }});
        if (!refundState) {
            throw new BadRequestException(`Payment state 'refunded' not found`);}

        const paymentToRefund = await this.findPaymentById(id, userId, isAdmin);
        if (!paymentToRefund) {
            throw new NotFoundException(`Payment with id ${id} not found`);
        }
        
        paymentToRefund.transactionDetails.paymentState = refundState;
        await this.transactionRepo.save(paymentToRefund);
        //Ahora busco el pago para el cual asignare el refund creado
        const payment = await this.findPaymentById(id, userId, isAdmin);
        //Ahora asigno el refund al pago
        payment.refundDetails = refund;
        await this.refundRepo.save(refund); 
        //formateo aca en vez de en el controller
        return {
            id : payment.id,
            orderId: payment.orderId,
            status: payment.transactionDetails.paymentState.name,
            refundDetails: {
                refundTransactionId: refund.refunId,
                refundStatus: "completed"},
            paymentMethod: payment.paymentMethod.name,
            refundTime: refund.refundTime
            };
    };

    async deletePayment(id: number, userId: number, isAdmin: boolean) {
        const payment = await this.findPaymentById(id, userId, isAdmin);
        await this.transactionRepo.remove(payment);
        return { message: 'deleted' };
    }
}
