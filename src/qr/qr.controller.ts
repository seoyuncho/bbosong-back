import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  Post,
  Body,
  Header,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  // GET /qr/png?text=hello
  @Get('png')
  async getPng(@Query('text') text: string, @Res() res: Response) {
    if (!text) throw new BadRequestException('text query parameter is required');
    const buffer = await this.qrService.toPngBuffer(text);
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK).send(buffer);
  }

  // GET /qr/dataurl?text=hello
  @Get('dataurl')
  async getDataUrl(@Query('text') text: string) {
    if (!text) throw new BadRequestException('text query parameter is required');
    const dataUrl = await this.qrService.toDataURL(text);
    return { dataUrl }; // { dataUrl: "data:image/png;base64,..." }
  }

  // POST /qr/png (raw body: { "text": "..." })
  @Post('png')
  async postPng(@Body('text') text: string, @Res() res: Response) {
    if (!text) throw new BadRequestException('text is required in body');
    const buffer = await this.qrService.toPngBuffer(text);
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK).send(buffer);
  }
}
