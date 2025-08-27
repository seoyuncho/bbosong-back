// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// import * as path from 'path';

// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV === 'production'
//       ? '.production.env'
//       : process.env.NODE_ENV === '.stage'
//         ? 'stage.env'
//       : '.development.env')
//   ),
// });

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe({
//     transform: true,
//   }));
//   app.enableCors({
//       origin: 'http://localhost:3000',
//       methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//       credentials: true,
//     });
//   await app.listen(process.env.PORT ?? 3000);
//   console.log(`Application is running on: ${await app.getUrl()}`);
// }
// bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 환경별 .env 파일 로드
dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'stage'
        ? 'stage.env'
        : '.development.env'
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe 전역 적용
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // CORS 설정: 배포 환경에서 프론트엔드 도메인 환경변수로 지정 가능
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // '*'는 모든 도메인 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 레일웨이에서 제공하는 포트와 호스트로 서버 시작
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on port ${port}`);
}
bootstrap();

