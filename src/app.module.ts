import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { UploadController } from './config/upload.controller';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: ['src/migrations/*.ts'],
      synchronize: true,
    }), BlogModule, AdminModule],

  controllers: [UploadController],
  providers: [],

})
export class AppModule { }
