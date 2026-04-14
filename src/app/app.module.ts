import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/users.module';
import { DatabaseModule } from '../database/database.module';
import { MortgageModule } from './modules/mortgage/mortgage.module';
import { RedisModule } from '../infrastructure/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    DatabaseModule,
    RedisModule,
    UsersModule,
    MortgageModule
  ],
})
export class AppModule { }
