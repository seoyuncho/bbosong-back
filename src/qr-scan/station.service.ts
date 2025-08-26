import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // PrismaService는 app에서 PrismaClient 감싼 서비스
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StationService {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string) {
    return this.prisma.station.findUnique({ where: { name } });
  }

  // StationService
  async borrowUmbrella(stationId: number) {
    const rentStart = new Date();
    const rentEnd = new Date();
    rentEnd.setHours(rentStart.getHours() + 24);

    // 기존: umbrella 새로 create ❌
    // 개선: 이미 있는 우산을 대여 상태로 업데이트 (station_borrow_id 기록)
    const umbrella = await this.prisma.umbrella.create({
      data: {
        qr_info: uuidv4(),
        station_borrow_id: stationId,
        rent_start: rentStart,
        rent_end: rentEnd,
      },
    });

    // station 재고 감소
    await this.prisma.station.update({
      where: { id: stationId },
      data: { current_umbrella_count: { decrement: 1 } },
    });

    return umbrella;
  }


  /// 반납
  async returnUmbrella(stationId: number, umbrellaId: string) {
    const umbrella = await this.prisma.umbrella.findUnique({
      where: { id: Number(umbrellaId) },
    });

    if (!umbrella) {
      throw new BadRequestException(`Umbrella ${umbrellaId} not found`);
    }
    if (!umbrella.rent_start || !umbrella.rent_end) {
      throw new BadRequestException(`Umbrella ${umbrellaId} is not currently borrowed`);
    }

    // 반납 처리
    const updatedUmbrella = await this.prisma.umbrella.update({
      where: { id: Number(umbrellaId) },
      data: {
        station_return_id: stationId,
        rent_returned: new Date(),
      },
    });

    // station 재고 증가
    await this.prisma.station.update({
      where: { id: stationId },
      data: { current_umbrella_count: { increment: 1 } },
    });

    return updatedUmbrella;
  }

}
