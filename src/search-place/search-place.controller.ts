import { Controller, Post, Body, Res } from '@nestjs/common';
import { SearchPlaceService } from './search-place.service';
import { Response } from 'express';

@Controller('search-place')
export class SearchPlaceController {
  constructor(private readonly searchPlaceService: SearchPlaceService) {}

  @Post()
  async searchPlace(@Body('placeName') placeName: string, @Res() res: Response) {
    try {
      const places = await this.searchPlaceService.searchNaverLocal(placeName);
      return res.json({ places });
    } catch (error) {
      console.error('Error searching for place:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}