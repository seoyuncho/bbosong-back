import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from '../prisma.service';
import { UserGender, UserType } from './dto/user-enum';
import { UserInfoDto } from './dto/user-info-dto';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UserService {
  constructor(
    private emailService: EmailService,
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    gender: UserGender,
    birthdate: Date | string,
    userType: UserType,
  ): Promise<void> {
    const userExist = await this.prisma.user.findUnique({ where: { email } });
    if (userExist) {
      throw new UnprocessableEntityException('이미 가입된 이메일입니다.');
    }

    const signupVerifyToken = uuidv4();

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        gender: gender as UserGender,
        birthdate: new Date(birthdate),
        usertype: userType as UserType,
        signupVerifyToken,
        isVerified: false,
      },
    });

    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { signupVerifyToken },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
    return this.authService.login({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('해당 이메일은 가입되지 않았습니다.');
    }
    if (!user.isVerified) {
      throw new NotFoundException('이메일 인증이 완료되지 않았습니다.');
    }
    if (user.password !== password) {
      throw new NotFoundException('비밀번호가 틀렸습니다.');
    }
    try {
      return this.authService.login({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      });
    } catch (e) {
      throw new NotFoundException('로그인에 실패했습니다.');
    }
  }

  async getUserInfo(userId: number): Promise<UserInfoDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
