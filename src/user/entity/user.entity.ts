import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserGender, UserType } from '../dto/user-enum';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;

  @Column({ type: 'date' })
  birthdate: Date | string;

  @Column({ type: 'enum', enum: UserType })
  userType: UserType;

  @Column({ length: 60 })
  signupVerifyToken: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
}