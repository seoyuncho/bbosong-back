import { Controller, Post, Get, Body, BadRequestException, Param } from '@nestjs/common';
import { QrScanService } from './qr-scan.service';

@Controller('qr-scan')
export class QrScanController {
  constructor(private readonly qrScanService: QrScanService) {}

  // @Post('scan')
  // async scanQr(@Body() payload: { station: string; action: 'borrow' | 'return'; umbrellaId: string }) {
  //   const { station, action, umbrellaId } = payload;

  //   if (!station || !action || !umbrellaId) {
  //     throw new BadRequestException('station, action, and umbrellaId are required');
  //   }

  //   console.log('▶ Received from frontend:', payload); // 프론트 payload 출력

  //   const updatedUmbrella = await this.qrScanService.processScan(station, action, umbrellaId);

  //   console.log('✅ DB update result:', updatedUmbrella); // DB 업데이트 결과 출력

  //   return { umbrella: updatedUmbrella };
  // }
  @Post('scan')
  async scanQr(@Body() payload: { station: string; action: 'borrow' | 'return'; umbrellaId?: string }) {
    const { station, action, umbrellaId } = payload;

    if (!station || !action) {
      throw new BadRequestException('station and action are required');
    }

    const updatedUmbrella = await this.qrScanService.processScan(station, action, umbrellaId);

    return { umbrella: updatedUmbrella };
  }

  // qr-scan.controller.ts
  @Get('umbrella/:id')
  async getUmbrellaInfo(@Param('id') id: string) {
    const umbrella = await this.qrScanService.findUmbrellaById(+id);
    return { umbrella };
  }

}
