import { Column, DeleteDateColumn, Entity } from "typeorm";
import { Role } from '../../common/enums/role.enum';
@Entity()
export class User {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false }) // select: false para que al buscar usuarios no devuelva la pssword por mas que este hasheada
  password: string;

  @Column({ type: 'enum', enum: Role , default: Role.CLIENT })
  role: Role;

  @DeleteDateColumn()
  deletedAt: Date;
}