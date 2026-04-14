import { CreateMortgageProfileDto } from '../dto';
import { MortgageComputedValues } from '../types/mortgage.types';

export enum MortgageStrategyType {
  ANNUITY = 'annuity'
}

export interface IMortgageCalculationStrategy {
  readonly type: MortgageStrategyType;
  calculate(dto: CreateMortgageProfileDto): MortgageComputedValues;
}
