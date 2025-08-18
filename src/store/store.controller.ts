import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './entity/store.entity';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeService.create(createStoreDto);
  }

  @Get('/hashtag/:tagName')
  async findByHashtag(@Param('tagName') tagName: string): Promise<Store[]> {
    console.log(`Searching for stores with hashtag: #${tagName}`);
    const stores = await this.storeService.findByHashtag(tagName);
    if (!stores || stores.length === 0) {
      throw new NotFoundException(
        `No stores found with hashtag: #${tagName}`,
      );
    }
    return stores;
  }
}