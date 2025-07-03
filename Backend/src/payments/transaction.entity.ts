import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn,OneToOne } from 'typeorm';
import { PaymentMethod } from './paymentmethod.entity';
import { transactionDetail } from './transactionDetail.entity';
import {refund} from './refund.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column()
    amount: number;

    //En esta columna de la bd guardo el puntero al metodo de pago
    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.transactions, { eager: true })
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod: PaymentMethod;

    //En esta columna de la bd guardo el puntero al detalle de la transaccion
    @OneToOne(() => transactionDetail, transactionDetail => transactionDetail.transactionId, { cascade: true })
    @JoinColumn()
    transactionDetails: transactionDetail;

    @Column()
    paymentTime: string;

    @Column({ default: 'paid' })
    status: string;

    @OneToOne(() => refund)
    @JoinColumn({ name: 'refundId' })
    refundDetails?: refund;

}

