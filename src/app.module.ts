import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import authConfig from './config/authConfig'
import { QrScanModule } from './qr-scan/qr-scan.module';
import { AppController } from './app.controller';
import { SearchPlaceModule } from './search-place/search-place.module';
import { StoreModule } from './store/store.module';
import { PrismaService } from './prisma.service';
import { UserQRModule } from './user_qr/user-qr.module';
import { WeatherModule } from './weather/weather.module';


@Module({
  imports: [
    UserModule,
    AuthModule,
    QrScanModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    SearchPlaceModule,
    StoreModule,
    UserQRModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})

export class AppModule {}