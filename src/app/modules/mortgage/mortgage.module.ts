import { Module } from '@nestjs/common';
import { MortgageService } from './mortgage.service';
import { MortgageController } from './mortgage.controller';
import { MortgageRepository } from './repositories/mortgage.repository';

@Module({
  controllers: [MortgageController],
  providers: [MortgageService, MortgageRepository],
})
export class MortgageModule {}
