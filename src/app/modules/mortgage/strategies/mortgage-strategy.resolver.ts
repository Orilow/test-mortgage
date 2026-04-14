import { Injectable } from '@nestjs/common';
import { CreateMortgageProfileDto } from '../dto';
import { AnnuityMortgageStrategy } from './annuity-mortgage.strategy';
import {
  IMortgageCalculationStrategy,
  MortgageStrategyType
} from './mortgage-calculation-strategy.interface';

@Injectable()
export class MortgageStrategyResolver {
  private readonly strategyMap = new Map<
    MortgageStrategyType,
    IMortgageCalculationStrategy
  >();

  constructor(annuityStrategy: AnnuityMortgageStrategy) {
    this.strategyMap.set(annuityStrategy.type, annuityStrategy);
  }

  // TODO later
  resolve(_dto: CreateMortgageProfileDto): IMortgageCalculationStrategy {
    return this.resolveByType(MortgageStrategyType.ANNUITY);
  }

  resolveByType(type: MortgageStrategyType): IMortgageCalculationStrategy {
    const strategy = this.strategyMap.get(type);
    if (!strategy) {
      throw new Error(`Strategy '${type}' is not configured`);
    }

    return strategy;
  }
}
