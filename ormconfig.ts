import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'seoyunch0^^',
  database: 'bbosong',
  charset: 'utf8mb4',
  entities: [__dirname + '/**/*.entity{.ts}'],
  synchronize: false,
  migrations: [__dirname + '/**/migrations/*.ts'],
  migrationsTableName: 'migrations',
});