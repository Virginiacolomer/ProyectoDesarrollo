import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class refund {
    @PrimaryGeneratedColumn()
    refunId: number;

    @Column()
    reason: string; 

    @Column()
    refundTime: string;

//NO es necesario un estado,porque si creo un refund,siempre estara completado,en el response es solo decorativo
}
