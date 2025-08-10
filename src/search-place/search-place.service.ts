import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchPlaceService {
  private readonly naverClientID: string;
  private readonly naverClientSecret: string;

  constructor(
    private readonly configService: ConfigService) {
    this.naverClientID = this.configService.get<string>('NAVER_CLIENT_ID');
    this.naverClientSecret = this.configService.get<string>('NAVER_CLIENT_SECRET');
  }

  async searchNaverLocal(query: string) {
    try {
      const response = await axios.get(
        `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=10`,
        {
          headers: {
            'X-Naver-Client-Id': this.naverClientID,
            'X-Naver-Client-Secret': this.naverClientSecret,
          },
        },
      );
      return response.data.items;
    } catch (error) {
      throw new InternalServerErrorException('Error from Naver API');
    }
  }
}