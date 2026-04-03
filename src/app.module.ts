import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { SecurityModule } from './password/security.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',       // 본섭 환경변수
      //envFilePath: '.env.test',  // 테섭 환경변수
      //envFilePath: '.env.local',   // 로컬 환경변수
      load: [databaseConfig]
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    LoggerModule,
    DatabaseModule,
    SecurityModule,

  ]
})
export class AppModule { }
