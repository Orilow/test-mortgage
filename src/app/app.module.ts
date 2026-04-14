import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/users.module';
import { DatabaseModule } from '../database/database.module';
import { MortgageModule } from './modules/mortgage/mortgage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    DatabaseModule,
    UsersModule,
    MortgageModule
  ],
})
export class AppModule { }
