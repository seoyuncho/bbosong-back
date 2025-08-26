import { Module } from '@nestjs/common';
import { QrScanController } from './qr-scan.controller';
import { QrScanService } from './qr-scan.service';
import { StationService } from './station.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [QrScanController],
  providers: [QrScanService, StationService, PrismaService],
})
export class QrScanModule {}
