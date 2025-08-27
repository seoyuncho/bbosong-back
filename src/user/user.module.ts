import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/email/email.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [EmailModule],
  controllers: [UserController],
  providers: [UserService, AuthService, PrismaService]
})

export class UserModule {}