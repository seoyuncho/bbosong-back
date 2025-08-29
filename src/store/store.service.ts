import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
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

  async findByName(name: string): Promise<StoreMarkerDto[]> {
    const stores = await this.prisma.store.findMany({
      where: {
        name: { contains: name },
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

  // id로 특정 스토어 불러오기 (해시태그 포함)
  // async findOne(id: number) {
  //   return this.prisma.store.findUnique({
  //     where: { id },
  //     include: { hashtags: true },
  //   });
  // }

  // 해시태그 이름으로 가게 목록을 찾는 메서드
  async findByHashtag(tagName: string): Promise<StoreMarkerDto[]> {
    const stores = await this.prisma.store.findMany({
      where: {
        hashtags: {
          some: {
            hashtag: {
              // ✅ StoreHashtag → Hashtag로 들어가서 필터링
              tag_name: {
                equals: tagName,
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
