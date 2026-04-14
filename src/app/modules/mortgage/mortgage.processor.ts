import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MortgageCalculationResponseDto } from './dto';
import { MortgageCacheService } from './services';
import { MortgageRepository } from './repositories';
import {
  MortgageStrategyResolver
} from './strategies';
import { MortgageCalculationJobPayload } from './types/mortgage.types';

@Processor('mortgage-calculation')
export class MortgageProcessor {
  constructor(
    private readonly mortgageRepository: MortgageRepository,
    private readonly mortgageStrategyResolver: MortgageStrategyResolver,
    private readonly mortgageCacheService: MortgageCacheService
  ) {}

  @Process('calculate')
  async handleCalculationJob(
    job: Job<MortgageCalculationJobPayload>
  ): Promise<void> {
    const { calculationId, inputHash, dto } = job.data;

    try {
      const strategy = this.mortgageStrategyResolver.resolve(dto);
      const computed = strategy.calculate(dto);
      await this.mortgageRepository.markCalculationReady(
        calculationId,
        computed
      );

      const responsePayload: MortgageCalculationResponseDto = {
        monthlyPayment: computed.monthlyPayment.toFixed(2),
        totalPayment: computed.totalPayment.toFixed(2),
        totalOverpaymentAmount: computed.totalOverpaymentAmount.toFixed(2),
        possibleTaxDeduction: computed.possibleTaxDeduction.toFixed(2),
        savingsDueMotherCapital: computed.savingsDueMotherCapital.toFixed(2),
        recommendedIncome: computed.recommendedIncome.toFixed(2),
        mortgagePaymentSchedule: computed.paymentSchedule
      };

      await this.mortgageCacheService.setCalculationIdByHash(
        inputHash,
        calculationId
      );
      await this.mortgageCacheService.setCalculationPayloadById(
        calculationId,
        JSON.stringify(responsePayload)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown worker error';
      await this.mortgageRepository.markCalculationFailed(
        calculationId,
        errorMessage
      );
      throw error;
    }
  }
}
