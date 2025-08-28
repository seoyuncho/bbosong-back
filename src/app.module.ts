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
import { MypageModule } from './mypage/mypage.module';
import Joi from 'joi';


@Module({
  imports: [
    UserModule,
    AuthModule,
    QrScanModule,
    ConfigModule.forRoot({
      // envFilePath: [`.env`],
      envFilePath: process.env.NODE_ENV === 'production' ? [] : ['.env'], 
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_BASE_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    SearchPlaceModule,
    StoreModule,
    UserQRModule,
    WeatherModule,
    MypageModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})

export class AppModule {}