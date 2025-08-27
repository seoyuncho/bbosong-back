import { Module } from '@nestjs/common';
import { UserQRService } from './user-qr.service';
import { UserQRController } from './user-qr.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserQRController],
  providers: [UserQRService, PrismaService],
})
export class UserQRModule {}
