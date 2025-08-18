import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  // PNG Buffer 반환
  async toPngBuffer(text: string, opts?: QRCode.QRCodeToBufferOptions): Promise<Buffer> {
    return QRCode.toBuffer(text, { type: 'png', ...opts });
  }

  // Data URL (base64) 반환
  async toDataURL(text: string, opts?: QRCode.ToDataURLOptions): Promise<string> {
    return QRCode.toDataURL(text, opts);
  }
}
