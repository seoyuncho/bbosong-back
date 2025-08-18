import { UserGender, UserType } from './user-enum';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  gender: UserGender;
  birthdate: Date;
  userType: UserType;
}