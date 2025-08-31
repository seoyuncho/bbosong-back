import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StoreService, StoreMarkerDto } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('initialmap')
  async getStores() {
    console.log('Fetching all stores for initial map...');
    return this.storeService.findAll();
  }

  @Post('search')
  async searchStoreByName(
    @Body('name') name: string,
  ): Promise<StoreMarkerDto[]> {
    if (!name) throw new NotFoundException('검색어가 필요합니다.');
    console.log(`Searching for stores with name: ${name}`);
    return this.storeService.findByName(name);
  }

  // @Get(':id')
  // async getStore(@Param('id') id: number) {
  //   console.log(`Fetching store with ID: ${id}`);
  //   return this.storeService.findOne(id);
  // }

  @Get('hashtag/:tagName')
  async findByHashtag(
    @Param('tagName') tagName: string,
  ): Promise<StoreMarkerDto[]> {
    console.log(`Searching for stores with hashtag: #${tagName}`);
    const stores = await this.storeService.findByHashtag(tagName);
    return stores;
  }
}
