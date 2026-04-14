import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MortgageController } from './mortgage.controller';
import { MortgageProcessor } from './mortgage.processor';
import { MortgageService, MortgageCacheService } from './services';
import { MortgageRepository } from './repositories';
import {
  AnnuityMortgageStrategy,
  MortgageStrategyResolver
} from './strategies';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: Number(configService.getOrThrow<string>('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD') || undefined
        }
      })
    }),
    BullModule.registerQueue({ name: 'mortgage-calculation' })
  ],
  controllers: [MortgageController],
  providers: [
    MortgageService,
    MortgageRepository,
    MortgageCacheService,
    AnnuityMortgageStrategy,
    MortgageStrategyResolver,
    MortgageProcessor
  ]
})
export class MortgageModule {}
