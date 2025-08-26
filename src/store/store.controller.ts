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
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './entity/store.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      // 파일이 없을 경우 예외 처리
      throw new NotFoundException('Image file not found.');
    }
    const imageUrl = `/uploads/${file.filename}`;
    return this.storeService.create(createStoreDto, imageUrl);
  }

  @Get('initialmap')
  async getStores() {
    console.log('Fetching all stores for initial map...');
    return this.storeService.findAll();
  }

  @Get(':id')
  async getStore(@Param('id') id: number) {
    console.log(`Fetching store with ID: ${id}`);
    return this.storeService.findOne(id);
  }

  @Get('hashtag/:tagName')
  async findByHashtag(@Param('tagName') tagName: string): Promise<StoreMarkerDto[]> {
    console.log(`Searching for stores with hashtag: #${tagName}`);
    const stores = await this.storeService.findByHashtag(tagName);
    return stores;
  }
}