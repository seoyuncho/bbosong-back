import { Controller, Post, Body, Get, Query} from '@nestjs/common';
import { UserQRService } from './user-qr.service';


@Controller('user-qr')
export class UserQRController {
  constructor(private userQRService: UserQRService) {}

  // -----------------------------
  // 대여 API
  // -----------------------------
  @Post('rent')
  async rentUmbrella(
    @Body() body: { userId: number; borrowStationName: string }
  ) {
    const { userId, borrowStationName } = body;
    const result = await this.userQRService.rentUmbrella(userId, borrowStationName);
    return result;
  }

  // -----------------------------
  // 반납 API
  // -----------------------------
  @Post('return')
  async returnUmbrella(
    @Body() body: { userId: number; returnStationName: string }
  ) {
    const { userId, returnStationName } = body;
    const result = await this.userQRService.returnUmbrella(userId, returnStationName);
    return result;
  }

  // -----------------------------
  // 리워드 API
  // -----------------------------  
  @Post('redeem-bubble')
  async redeemBubble(
    @Body('userId') userId: number,
    @Body('storeName') storeName: string,
  ) {
    return this.userQRService.redeemStoreBubble(userId, storeName);
  }

  // 유저 대여 우산 조회
  @Get('my-umbrella')
  async getUserUmbrella(@Query('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) throw new Error('Invalid userId');

    const result = await this.userQRService.getUserUmbrella(id);
    return result; // { umbrella: { ... } } 혹은 { umbrella: null }
  }
}

