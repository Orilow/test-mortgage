import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  CreateMortgageProfileDto,
  CreateMortgageProfileResponseDto,
  MortgageCalculationResponseDto
} from './dto';
import { MortgageRepository } from './repositories/mortgage.repository';
import {
  MortgageComputedValues,
  MortgagePaymentSchedule
} from './types/mortgage.types';

@Injectable()
export class MortgageService {
  private static readonly DEFAULT_USER_ID = 'demo-user';

  constructor(private readonly mortgageRepository: MortgageRepository) {}

  async getMortgageProfile(
    id: string
  ): Promise<MortgageCalculationResponseDto> {
    const calculationId = Number(id);
    if (!Number.isInteger(calculationId) || calculationId <= 0) {
      throw new BadRequestException('Invalid mortgage calculation id');
    }

    const calculation =
      await this.mortgageRepository.findCalculationById(calculationId);
    if (!calculation) {
      throw new NotFoundException('Mortgage calculation not found');
    }

    return {
      monthlyPayment: calculation.monthlyPayment,
      totalPayment: calculation.totalPayment,
      totalOverpaymentAmount: calculation.totalOverpaymentAmount,
      possibleTaxDeduction: calculation.possibleTaxDeduction,
      savingsDueMotherCapital: calculation.savingsDueMotherCapital,
      recommendedIncome: calculation.recommendedIncome,
      mortgagePaymentSchedule: JSON.parse(calculation.paymentSchedule)
    };
  }

  async createMortgageProfile(
    createMortgageProfileDto: CreateMortgageProfileDto
  ): Promise<CreateMortgageProfileResponseDto> {
    const computed = this.calculateMortgage(createMortgageProfileDto);

    const id = await this.mortgageRepository.createProfileAndCalculation(
      MortgageService.DEFAULT_USER_ID,
      createMortgageProfileDto,
      computed
    );

    return { id: id.toString() };
  }

  private calculateMortgage(
    dto: CreateMortgageProfileDto
  ): MortgageComputedValues {
    const matCapital = dto.matCapitalIncluded ? (dto.matCapitalAmount ?? 0) : 0;
    const loanAmount = Math.max(
      dto.propertyPrice - dto.downPaymentAmount - matCapital,
      0
    );
    const totalMonths = dto.mortgageTermYears * 12;
    const monthlyRate = dto.interestRate / 12 / 100;

    const monthlyPayment =
      monthlyRate === 0
        ? loanAmount / totalMonths
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const roundedMonthlyPayment = this.round2(monthlyPayment);
    const totalPayment = this.round2(roundedMonthlyPayment * totalMonths);
    const totalOverpaymentAmount = this.round2(totalPayment - loanAmount);

    const homeDeduction = this.round2(
      Math.min(dto.propertyPrice, 2_000_000) * 0.13
    );
    const interestDeduction = this.round2(
      Math.min(totalOverpaymentAmount, 3_000_000) * 0.13
    );
    const possibleTaxDeduction = this.round2(homeDeduction + interestDeduction);

    const savingsDueMotherCapital = this.round2(matCapital);
    const recommendedIncome = this.round2(roundedMonthlyPayment * 1.6);
    const paymentSchedule = this.buildPaymentSchedule(
      loanAmount,
      totalMonths,
      monthlyRate,
      roundedMonthlyPayment
    );

    return {
      monthlyPayment: roundedMonthlyPayment,
      totalPayment,
      totalOverpaymentAmount,
      possibleTaxDeduction,
      savingsDueMotherCapital,
      recommendedIncome,
      paymentSchedule
    };
  }

  private buildPaymentSchedule(
    initialLoanAmount: number,
    totalMonths: number,
    monthlyRate: number,
    monthlyPayment: number
  ): MortgagePaymentSchedule {
    const schedule: MortgagePaymentSchedule = {};
    let remaining = initialLoanAmount;

    for (let monthIndex = 1; monthIndex <= totalMonths; monthIndex++) {
      const year = Math.ceil(monthIndex / 12).toString();
      const month = (((monthIndex - 1) % 12) + 1).toString();
      schedule[year] ??= {};

      const interestPayment = this.round2(remaining * monthlyRate);
      const principalPayment = this.round2(monthlyPayment - interestPayment);
      remaining = this.round2(Math.max(remaining - principalPayment, 0));

      schedule[year][month] = {
        totalPayment: monthlyPayment,
        repaymentOfMortgageBody: principalPayment,
        repaymentOfMortgageInterest: interestPayment,
        mortgageBalance: remaining
      };
    }

    return schedule;
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
