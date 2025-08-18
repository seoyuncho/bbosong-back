import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entity/store.entity';
import { Hashtag } from 'src/hashtag/entity/hashtag.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  // 새로운 가게와 해시태그를 저장하는 메서드
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { hashtags, ...storeData } = createStoreDto;

    const store = this.storeRepository.create(storeData);

    if (hashtags && hashtags.length > 0) {
      const hashtagEntities = await Promise.all(
        hashtags.map(async (tagName) => {
          // 이미 존재하는 해시태그인지 확인
          let hashtag = await this.hashtagRepository.findOne({
            where: { tag_name: tagName },
          });
          // 없으면 새로 생성
          if (!hashtag) {
            hashtag = this.hashtagRepository.create({ tag_name: tagName });
            await this.hashtagRepository.save(hashtag);
          }
          return hashtag;
        }),
      );
      store.hashtag = hashtagEntities;
    }

    return this.storeRepository.save(store);
  }

  // 해시태그 이름으로 가게 목록을 찾는 메서드
  async findByHashtag(tagName: string): Promise<Store[]> {
    const hashtag = await this.hashtagRepository.findOne({
      where: { tag_name: tagName },
      relations: ['store'],
    });

    if (!hashtag) {
      // 해당 해시태그가 없으면 빈 배열 반환
      return [];
    }

    return hashtag.store;
  }
}