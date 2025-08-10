import { Module } from '@nestjs/common';
import { SearchPlaceController } from './search-place.controller';
import { SearchPlaceService } from './search-place.service';

@Module({
  imports: [], // 다른 모듈을 가져올 때 사용
  controllers: [SearchPlaceController], // SearchPlaceController 등록
  providers: [SearchPlaceService], // SearchPlaceService 등록
  exports: [SearchPlaceService], // 다른 모듈에서 사용될 경우 export
})

export class SearchPlaceModule {}