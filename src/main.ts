import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || 3333);

}
bootstrap();
