import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from './entity/store.entity';
import { Hashtag } from 'src/hashtag/entity/hashtag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Hashtag]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}