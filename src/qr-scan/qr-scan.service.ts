import { Injectable, BadRequestException } from '@nestjs/common';
import { StationService } from './station.service';
import { PrismaService } from '../prisma.service';


@Injectable()
export class QrScanService {
  constructor(
    private readonly stationService: StationService,
    private readonly prisma: PrismaService
  ) {}

  // POST /umbrellas/scan
  async processScan(
    stationName: string,
    action: 'borrow' | 'return',
    umbrellaId?: string,
  ) {
    const station = await this.stationService.findByName(stationName);
    if (!station) throw new BadRequestException(`Station ${stationName} not found`);

    if (action === 'borrow') {
      return this.stationService.borrowUmbrella(station.id);
    }

    if (action === 'return') {
      if (!umbrellaId) throw new BadRequestException('umbrellaId required for return');
      return this.stationService.returnUmbrella(station.id, umbrellaId);
    }
  }

  // GET /umbrellas/:id
  async findUmbrellaById(id: number) {
    const umbrella = await this.prisma.umbrella.findUnique({
      where: { id },
      // include: { station_borrow_id: true }, // station.name 같이 가져옴
    });

    if (!umbrella) {
      throw new BadRequestException(`Umbrella ${id} not found`);
    }

    return umbrella;
  }
}
