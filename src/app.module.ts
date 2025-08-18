import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import authConfig from './config/authConfig'
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrModule } from './qr/qr.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    UserModule,
    AuthModule,
    QrModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'false',
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
    }),
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule {}