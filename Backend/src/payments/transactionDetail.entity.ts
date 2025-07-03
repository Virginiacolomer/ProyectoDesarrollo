import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne} from 'typeorm';
import { transactionStatus } from './transactionstatus.entity';


@Entity()
export class transactionDetail {
    @PrimaryGeneratedColumn('uuid')
    transactionId:string;

    
    @Column({default:1})
    paymentStateId: number;
    

    @ManyToOne(() => transactionStatus)
    @JoinColumn({ name: 'paymentStateId' })
    paymentState: transactionStatus;

};


