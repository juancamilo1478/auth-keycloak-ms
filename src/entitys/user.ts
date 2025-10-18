// src/users/user.entity.ts
import { Role } from 'src/enums/roles';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MinLength } from 'class-validator';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum:Role,
    default: Role.CLIENTE
  })
  role: Role;

  @Column()
  password: string;
}
