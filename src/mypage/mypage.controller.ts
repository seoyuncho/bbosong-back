import { Controller, Get, Query } from '@nestjs/common';
import { MypageService } from './mypage.service';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @Get()
  async getMyPage(@Query('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid userId');
    }

    return this.mypageService.getUserProfile(id);
  }
}
