import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import {State} from './state.entity'; 
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  restaurantId: number;

  @ManyToOne(()=> State)
  @JoinColumn({name:"state_id"})
  status: State;

  @Column({ type: 'jsonb', nullable: true }) //nullable=opcional
  delivery: any;

  @Column('int', { array: true })
  products: number[];

  //Location no corresponde a una entidad en nuestro dominio,queda como un simple JSON
  @Column({ type: 'json' })
  location: any;

  @CreateDateColumn()
  createdAt: Date;
}
