import { Controller, Get, Post, Param, Body, Put, Delete,Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { RefundDto } from './dto/refund.dto';
import { AuthGuard } from "../auth/guard/auth.guard";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Role } from "../common/enums/role.enum";
import { Auth } from "../auth/decorators/auth.decorator";
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}
    
    @Get()
    @Auth(Role.CLIENT)
    @UseGuards(AuthGuard, RolesGuard)
    async findAllPayments(@Query('page') page = '1', @Query('limit') limit = '10',  @Req() req: RequestWithUser,) {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const user = req.user;

        const isAdmin = user.role === Role.ADMIN;

        const { data, total } = isAdmin
            ? await this.paymentsService.findAllPayments(pageNumber, limitNumber)
            : await this.paymentsService.findPaymentsByUser(user.id, pageNumber, limitNumber);
        console.log(data[0]);

        //Aca no uso el formatResponse porque prefiero una arrowfunction dado que tengo un array
        return {
            data: data.map(payment => ({
                id: payment.id,
                orderId: payment.orderId,
                amount: payment.amount,
                transactionDetails: {transactionId: payment.transactionDetails.transactionId,
                                     paymentStatus: payment.transactionDetails.paymentState.name,
                },  
                paymentMethod: payment.paymentMethod.name,
                paymentTime: payment.paymentTime
            })),
            total, 
            page: pageNumber,
            limit: limitNumber,
        };
    }

    @Get(':id')
    @Auth(Role.CLIENT)
    @UseGuards(AuthGuard, RolesGuard)
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
        const user = req.user;
        const isAdmin = user.role === Role.ADMIN;
        const payment = await this.paymentsService.findPaymentById(id, user.id, isAdmin);
        return this.formatResponse(payment);
    }


    @Post()
    @Auth(Role.CLIENT)
    @UseGuards(AuthGuard, RolesGuard)
    async createPayment(@Body() paymentData: CreatePaymentDto, @Req() req: RequestWithUser) {
        const payment = await this.paymentsService.createPayment({
        ...paymentData,
        userId: req.user.id, // 👈 aseguramos que siempre venga del token
    });
        return this.formatResponse(payment);
    }

    @Put(':id/status')
    @Auth(Role.CLIENT)
    @UseGuards(AuthGuard, RolesGuard)
    async updateStatus(@Param('id') id: number, @Body() status: UpdateStatusDto, @Req() req: RequestWithUser) {
        const user = req.user;
        const isAdmin = user.role === Role.ADMIN;
        const payment = await this.paymentsService.updatePaymentStatus(id, status, user.id, isAdmin);
        return this.formatResponse(payment);
    }

    @Post(':id/refund')
    @Auth(Role.CLIENT)
    @UseGuards(AuthGuard, RolesGuard)
    async refundPayment(@Param('id') id: number, @Body() refund: RefundDto, @Req() req: RequestWithUser) {
        const user = req.user;
        const isAdmin = user.role === Role.ADMIN;
        const payment = await this.paymentsService.refundPayment(id, refund, user.id, isAdmin);
    return payment;
    }

   @Delete(':id')
    @Auth(Role.CLIENT)
    @UseGuards(AuthGuard, RolesGuard)
    async deletePayment(@Param('id') id: number, @Req() req: RequestWithUser) {
        const user = req.user;
        const isAdmin = user.role === Role.ADMIN;
        return this.paymentsService.deletePayment(id, user.id, isAdmin);
    }

    //Hicimos este método para formatear la respuesta de los pagos acorde al pdf, dejando algunos atributos de lado. 
    formatResponse(payment) {
        return {
            id: payment.id,
            orderId: payment.orderId,
            status: payment.status, // es un string
            amount: payment.amount,
            transactionDetails: {
                transactionId: payment.transactionDetails.transactionId,
                paymentStatus: payment.transactionDetails.paymentState.name, 
            },
            paymentMethod: payment.paymentMethod.name,
            paymentTime: payment.paymentTime,
        };
    }
}
