import { Injectable } from '@nestjs/common';
import { CreateMortgageProfileDto } from '../dto';
import {
  MortgageComputedValues,
  MortgagePaymentSchedule
} from '../types/mortgage.types';
import {
  IMortgageCalculationStrategy,
  MortgageStrategyType
} from './mortgage-calculation-strategy.interface';

@Injectable()
export class AnnuityMortgageStrategy implements IMortgageCalculationStrategy {
  readonly type = MortgageStrategyType.ANNUITY;

  calculate(dto: CreateMortgageProfileDto): MortgageComputedValues {
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
