import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserGender, UserType } from './dto/user-enum';
import { UserInfoDto } from './dto/user-info-dto';

@Injectable()
export class UserService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
  ) { }

  async createUser(name: string, email: string, password: string, gender: UserGender, birthdate: Date | string, userType: UserType): Promise<void> {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException('이미 가입된 이메일입니다.');
    }

    const signupVerifyToken = uuid.v1();

    // await this.saveUser(name, email, password, signupVerifyToken);
    // await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken);
    await this.saveUserUsingTransaction(name, email, password, gender, birthdate, userType, signupVerifyToken);

    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        email: emailAddress
      }
    });

    return user !== null;
  }

  private async saveUser(name: string, email: string, password: string, gender: UserGender, birthdate: Date, userType: UserType, signupVerifyToken: string) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.gender = gender;
    user.birthdate = birthdate;
    user.userType = userType;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async saveUserUsingQueryRunner(name: string, email: string, password: string, gender: UserGender, birthdate: Date, userType: UserType, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.gender = gender;
      user.birthdate = birthdate;
      user.userType = userType;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(name: string, email: string, password: string, gender: UserGender, birthdate: Date | string, userType: UserType, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.gender = gender;
      user.birthdate = birthdate;
      user.userType = userType;
      user.signupVerifyToken = signupVerifyToken;
      console.log()
      await manager.save(user);

      // throw new InternalServerErrorException();
    })
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    
    user.isVerified = true;
    await this.usersRepository.save(user);

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    // 이메일 존재 여부 확인
    const userByEmail = await this.usersRepository.findOne({ where: { email } });
    if (!userByEmail) {
      throw new NotFoundException('해당 이메일은 가입되지 않았습니다.');
    }

    // 이메일 인증 여부 확인
    if (!userByEmail.isVerified) {
      throw new NotFoundException('이메일 인증이 완료되지 않았습니다.');
    }

    // 비밀번호 일치 여부 확인
    if (userByEmail.password !== password) {
      throw new NotFoundException('비밀번호가 틀렸습니다.');
    }

    console.log(
        'User login',
        { id: userByEmail.id, email: userByEmail.email }
    );
    try {
      return this.authService.login({
        id: userByEmail.id,
        name: userByEmail.name,
        email: userByEmail.email,
      });
    } catch (e) {
      throw new NotFoundException('로그인에 실패했습니다.');
    }
  }

  async getUserInfo(userId: string): Promise<UserInfoDto> {
        const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

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