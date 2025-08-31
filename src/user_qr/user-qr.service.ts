import { PrismaService } from "src/prisma.service";
import { Prisma } from "@prisma/client";
import { Injectable,NotFoundException } from '@nestjs/common';
import logger from '../logger/logger';

// 두 좌표(lat/lon) 간 거리 계산 (km 단위)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


@Injectable()
export class UserQRService {
  constructor(private prisma: PrismaService) {}

  // -----------------------------
  // userId로 유저 조회
  // -----------------------------
  async findUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        umbrellaId: true,
        travelDistance: true,
        rentCount: true,
        bubbleCount: true,
      },
    });
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      throw new Error('User not found');
    }
    return user;
  }

  // -----------------------------
  // 대여
  // -----------------------------
  async rentUmbrella(userId: number, borrowStationName: string) {
    const user = await this.findUserById(userId);

    const station = await this.prisma.station.findFirst({
      where: { name: borrowStationName },
    });
    if (!station) throw new Error('Borrow station not found');
    if (station.current_umbrella_count <= 0) throw new Error('No umbrellas available at this station');


    return this.prisma.$transaction(async (prisma) => {
      const rentStart = new Date();
      const rentEnd = new Date(rentStart.getTime() + 24 * 60 * 60 * 1000);

      // 새 우산 생성
      const umbrella = await prisma.umbrella.create({
        data: {
          qr_info: `UM-${Date.now()}`,
          rent_start: rentStart,
          rent_end: rentEnd,
          rent_returned: null,
          station_borrow_id: station.id,
          station_return_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // 유저 업데이트
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          rentCount: { increment: 1 },
          umbrellaId: umbrella.id,
        },
      });

       // station 우산 개수 감소
      await prisma.station.update({
        where: { id: station.id },
        data: {
          current_umbrella_count: { decrement: 1 },
        },
      });

      logger.info(`[RFID] 우산 ${user.umbrellaId} 대여 처리!`);
      logger.info(`[QR] 우산 대여 완료!`);
      return { user: updatedUser, umbrella };
    });
  }

  // -----------------------------
  // 반납
  // -----------------------------
  async returnUmbrella(userId: number, returnStationName: string) {
    const user = await this.findUserById(userId);
    if (!user.umbrellaId) throw new Error('No umbrella to return');

    const returnStation = await this.prisma.station.findFirst({
      where: { name: returnStationName },
    });
    if (!returnStation) throw new Error('Return station not found');

    const umbrella = await this.prisma.umbrella.findUnique({
      where: { id: user.umbrellaId },
      select: { station_borrow_id: true },
    });

    if (!umbrella) throw new Error('Umbrella not found');

    const borrowStation = await this.prisma.station.findUnique({
      where: { id: umbrella.station_borrow_id },
    });
    if (!borrowStation) throw new Error('Borrow station not found');

    const distance = getDistanceKm(
      borrowStation.latitude,
      borrowStation.longitude,
      returnStation.latitude,
      returnStation.longitude
    );

    return this.prisma.$transaction(async (prisma) => {
      // umbrella 업데이트
      await prisma.umbrella.update({
        where: { id: user.umbrellaId },
        data: {
          rent_returned: new Date(),
          station_return_id: returnStation.id,
          updated_at: new Date(),
        },
      });

      // user 업데이트
      await prisma.user.update({
        where: { id: user.id },
        data: {
          umbrellaId: null,
          bubbleCount: { increment: 1 },
          travelDistance: { increment: distance },
        },
      });

      // umbrellaTraces 추가
      await prisma.umbrellatraces.create({
        data: {
          umbrella_id: user.umbrellaId, // number
          station_id: returnStation.id,
          user_id: user.id,
          trace_time: new Date(),
        } as Prisma.umbrellatracesUncheckedCreateInput,
      });



       // station 우산 개수 증가
      await prisma.station.update({
        where: { id: returnStation.id },
        data: {
          current_umbrella_count: { increment: 1 },
        },
      });
      logger.info(`[RFID] 우산 ${user.umbrellaId} 반납 처리!`);
      logger.info(`[QR] 우산 반납 완료!`);
      return { message: 'Return processed successfully', distance };
    });
  }

  // -----------------------------
  // 스토어 버블 획득
  // -----------------------------
  async redeemStoreBubble(userId: number, storeName: string) {
    // 1. 스토어 찾기
    const store = await this.prisma.store.findFirst({
      where: { name: storeName },
    });
    if (!store) throw new Error('Store not found');

    // 2. 유저 업데이트 (버블 카운트 증가)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        bubbleCount: { increment: store.bubbleCount },
      },
    });

    // 3. 프론트에 스토어 정보 반환
    return store;
  }

 

  // -----------------------------
  // 유저 대여 우산 정보 조회
  // -----------------------------
  async getUserUmbrella(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { umbrellaId: true },
    });

    if (!user) throw new Error("User not found");
    if (!user.umbrellaId) return { umbrella: null };

    const umbrella = await this.prisma.umbrella.findUnique({
      where: { id: user.umbrellaId },
    });

    return { umbrella };
  }

  async getStationNameById(stationId: number): Promise<string> {
    const station = await this.prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      throw new NotFoundException("해당 스테이션을 찾을 수 없습니다.");
    }

    return station.name;
  }
  async getStationAddById(stationId: number): Promise<string> {
    const station = await this.prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      throw new NotFoundException("해당 스테이션을 찾을 수 없습니다.");
    }

    return station.address;
  }
  async getStationCurrentUmbrellaCountById(stationId: number): Promise<number> {
    const station = await this.prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      throw new NotFoundException("해당 스테이션을 찾을 수 없습니다.");
    }
    return station.current_umbrella_count;
  }

}
