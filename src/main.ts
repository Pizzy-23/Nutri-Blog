import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedAdmin } from './admin/admin.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  await seedAdmin(dataSource);

  await app.listen(3000);
}
bootstrap();