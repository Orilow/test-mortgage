import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { createHash } from 'crypto';
import { Queue } from 'bull';
import {
  CreateMortgageProfileDto,
  CreateMortgageProfileResponseDto,
  MortgageCalculationResponseDto
} from '../dto';
import { MortgageCacheService } from './mortgage-cache.service';
import { MortgageRepository } from '../repositories/mortgage.repository';
import { MortgageCalculationJobPayload } from '../types/mortgage.types';

@Injectable()
export class MortgageService {
  private static readonly DEFAULT_USER_ID = 'demo-user';

  constructor(
    private readonly mortgageRepository: MortgageRepository,
    private readonly mortgageCacheService: MortgageCacheService,
    @InjectQueue('mortgage-calculation')
    private readonly mortgageQueue: Queue<MortgageCalculationJobPayload>
  ) {}

  async getMortgageProfile(
    id: string
  ): Promise<MortgageCalculationResponseDto> {
    const calculationId = Number(id);
    if (!Number.isInteger(calculationId) || calculationId <= 0) {
      throw new BadRequestException('Invalid mortgage calculation id');
    }

    const cachedPayload =
      await this.mortgageCacheService.getCalculationPayloadById(calculationId);
    if (cachedPayload) {
      return JSON.parse(cachedPayload) as MortgageCalculationResponseDto;
    }

    const calculation =
      await this.mortgageRepository.findCalculationById(calculationId);
    if (!calculation) {
      throw new NotFoundException('Mortgage calculation not found');
    }

    if (calculation.status === 'pending') {
      throw new HttpException('Вычисления в процессе', HttpStatus.ACCEPTED);
    }

    if (calculation.status === 'failed') {
      throw new ConflictException(
        `Mortgage calculation failed: ${calculation.errorMessage ?? 'unknown error'}`
      );
    }

    const response: MortgageCalculationResponseDto = {
      monthlyPayment: calculation.monthlyPayment,
      totalPayment: calculation.totalPayment,
      totalOverpaymentAmount: calculation.totalOverpaymentAmount,
      possibleTaxDeduction: calculation.possibleTaxDeduction,
      savingsDueMotherCapital: calculation.savingsDueMotherCapital,
      recommendedIncome: calculation.recommendedIncome,
      mortgagePaymentSchedule: JSON.parse(calculation.paymentSchedule)
    };

    await this.mortgageCacheService.setCalculationPayloadById(
      calculationId,
      JSON.stringify(response)
    );
    return response;
  }

  async createMortgageProfile(
    createMortgageProfileDto: CreateMortgageProfileDto
  ): Promise<CreateMortgageProfileResponseDto> {
    const inputHash = this.getInputHash(
      createMortgageProfileDto,
      MortgageService.DEFAULT_USER_ID
    );

    const cachedId =
      await this.mortgageCacheService.getCalculationIdByHash(inputHash);
    if (cachedId) {
      return { id: cachedId };
    }

    const existingCalculation =
      await this.mortgageRepository.findByInputHash(inputHash);
    if (existingCalculation) {
      if (existingCalculation.status === 'ready') {
        await this.mortgageCacheService.setCalculationIdByHash(
          inputHash,
          existingCalculation.id
        );
      }
      return { id: existingCalculation.id.toString() };
    }

    let id: number;
    try {
      id = await this.mortgageRepository.createPendingProfileAndCalculation(
        MortgageService.DEFAULT_USER_ID,
        createMortgageProfileDto,
        inputHash
      );
    } catch (error) {
      // Handle race condition: another request created same inputHash first.
      const isDuplicate = this.isDuplicateInputHashError(error);
      if (!isDuplicate) {
        throw error;
      }

      const duplicated =
        await this.mortgageRepository.findByInputHash(inputHash);
      if (!duplicated) {
        throw error;
      }
      return { id: duplicated.id.toString() };
    }

    await this.mortgageQueue.add(
      'calculate',
      {
        calculationId: id,
        inputHash,
        dto: createMortgageProfileDto
      },
      {
        removeOnComplete: 20,
        removeOnFail: 20
      }
    );

    return { id: id.toString() };
  }

  private getInputHash(dto: CreateMortgageProfileDto, userId: string): string {
    return createHash('sha256')
      .update(JSON.stringify({ userId, ...dto }))
      .digest('hex');
  }

  private isDuplicateInputHashError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }
    const dbError = error as Error & { code?: string; message: string };
    return (
      dbError.code === 'ER_DUP_ENTRY' ||
      dbError.message.includes('Duplicate entry')
    );
  }
}
