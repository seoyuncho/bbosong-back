// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Store } from './entity/store.entity';
// import { Hashtag } from 'src/hashtag/entity/hashtag.entity';
// import { CreateStoreDto } from './dto/create-store.dto';
// import { StoreCategory } from './dto/store-enum';
// import { PrismaService } from '../prisma.service';

// export type StoreMarkerDto = {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
//   address: string;
//   category: string;
//   imageUrl: string | null;
// };

// @Injectable()
// export class StoreService {
//   constructor(
//     @InjectRepository(Store)
//     private storeRepository: Repository<Store>,
//     @InjectRepository(Hashtag)
//     private hashtagRepository: Repository<Hashtag>,
//   ) {}

//   // 새로운 가게와 해시태그를 저장하는 메서드
//   async create(
//     createStoreDto: CreateStoreDto,
//     imageUrl?: string,
//   ): Promise<Store> {
//     const { hashtags, ...storeData } = createStoreDto;

//     const store = this.storeRepository.create({ ...storeData, imageUrl });

//     if (hashtags && hashtags.length > 0) {
//       const hashtagEntities = await Promise.all(
//         hashtags.map(async (tagName) => {
//           // 이미 존재하는 해시태그인지 확인
//           let hashtag = await this.hashtagRepository.findOne({
//             where: { tag_name: tagName },
//           });
//           // 없으면 새로 생성
//           if (!hashtag) {
//             hashtag = this.hashtagRepository.create({ tag_name: tagName });
//             await this.hashtagRepository.save(hashtag);
//           }
//           return hashtag;
//         }),
//       );
//       store.hashtags = hashtagEntities;
//     }

//     return this.storeRepository.save(store);
//   }

//   // 전체 스토어 불러오기 (해시태그 포함)
//   async findAll(): Promise<Store[]> {
//     return this.storeRepository.find({
//       where: [{ category: StoreCategory.STATION }, { category: StoreCategory.SPONSOR }],
//       relations: ['hashtags'],
//     });
//   }

//   // id로 특정 스토어 불러오기 (해시태그 포함)
//   async findOne(id: number): Promise<Store> {
//     return this.storeRepository.findOne({
//       where: { id },
//       relations: ['hashtags'],
//     });
//   }

//   // 해시태그 이름으로 가게 목록을 찾는 메서드
//   async findByHashtag(tagName: string): Promise<StoreMarkerDto[]> {
//     console.log(`Searching for stores with hashtag: #${tagName}!!!`);
//     const rows = await this.storeRepository
//       .createQueryBuilder('s')
//       .innerJoin('s.hashtags', 'h', 'LOWER(h.tag_name) = LOWER(:tag)', {
//         tag: tagName,
//       })
//       .select([
//         's.id           AS id',
//         's.name         AS name',
//         's.latitude     AS latitude',
//         's.longitude    AS longitude',
//         's.address      AS address',
//         's.category     AS category',
//         's.image_url    AS imageUrl',
//       ])
//       .getRawMany<StoreMarkerDto>();
//     return rows;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreCategory } from './dto/store-enum';

export type StoreMarkerDto = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
  imageUrl: string | null;
};

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  // 새로운 가게와 해시태그를 저장하는 메서드
  async create(createStoreDto: CreateStoreDto, imageUrl?: string) {
    const { hashtags, ...storeData } = createStoreDto;

    const store = await this.prisma.store.create({
      data: {
        ...storeData,
        image_url: imageUrl || null,
        hashtags: hashtags
          ? {
              create: hashtags.map((tagName) => ({
                hashtag: {
                  connectOrCreate: {
                    where: { tag_name: tagName },
                    create: { tag_name: tagName },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        hashtags: {
          include: { hashtag: true }, // 해시태그 내용 같이 반환
        },
      },
    });

    return store;
  }

  // 전체 스토어 불러오기 (해시태그 포함)
  async findAll() {
    return this.prisma.store.findMany({
      where: {
        OR: [
          { category: StoreCategory.STATION },
          { category: StoreCategory.SPONSOR },
        ],
      },
      include: { hashtags: true },
    });
  }

  // id로 특정 스토어 불러오기 (해시태그 포함)
  async findOne(id: number) {
    return this.prisma.store.findUnique({
      where: { id },
      include: { hashtags: true },
    });
  }

  // 해시태그 이름으로 가게 목록을 찾는 메서드
  async findByHashtag(tagName: string): Promise<StoreMarkerDto[]> {
    const stores = await this.prisma.store.findMany({
      where: {
        hashtags: {
          some: {
            hashtag: {   // ✅ StoreHashtag → Hashtag로 들어가서 필터링
              tag_name: {
                equals: tagName
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        address: true,
        category: true,
        image_url: true,
      },
    });

    // Prisma select 결과 필드명 변환
    return stores.map((s) => ({
      id: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      address: s.address,
      category: s.category,
      imageUrl: s.image_url,
    }));
  }
}

