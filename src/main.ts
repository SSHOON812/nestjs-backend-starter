import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggingInterceptor } from './logger/Logging.interceptor';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(winstonLogger);
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor(winstonLogger));

  await app.listen(process.env.PORT || 3333);

}
bootstrap();
