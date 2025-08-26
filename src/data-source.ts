import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'bbosong_user',       // DB 계정
  password: 'bb1234',   // DB 비밀번호
  database: 'bbosong',       // DB 이름
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,     // 절대 true로 두지 마세요(실서비스에서 위험)
  logging: true,
});