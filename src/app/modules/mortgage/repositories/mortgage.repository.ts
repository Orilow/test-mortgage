import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Database } from '../../../../database/schema';
import { users } from '../../user/schemas/users';
import { mortgageCalculation, mortgageProfile } from '../schemas';
import {
  CreateMortgageInput,
  MortgageComputedValues,
  MortgageCalculationRecord,
} from '../types/mortgage.types';

@Injectable()
export class MortgageRepository {
  constructor(
    @Inject('DATABASE') private readonly db: Database,
  ) {}

  async createProfileAndCalculation(
    userId: string,
    input: CreateMortgageInput,
    computed: MortgageComputedValues,
  ): Promise<number> {
    return this.db.transaction(async (tx) => {
      await this.ensureUserExists(tx, userId);

      const profileIds = await tx.insert(mortgageProfile).values({
        userId,
        propertyPrice: input.propertyPrice.toString(),
        propertyType: input.propertyType,
        downPaymentAmount: input.downPaymentAmount.toString(),
        matCapitalAmount: input.matCapitalAmount?.toString() ?? null,
        matCapitalIncluded: input.matCapitalIncluded,
        mortgageTermYears: input.mortgageTermYears,
        interestRate: input.interestRate.toString(),
      }).$returningId();

      const profileId = profileIds[0]?.id;
      if (!profileId) {
        throw new Error('Failed to create mortgage profile');
      }

      const calculationIds = await tx.insert(mortgageCalculation).values({
        userId,
        mortgageProfileId: profileId,
        monthlyPayment: computed.monthlyPayment.toFixed(2),
        totalPayment: computed.totalPayment.toFixed(2),
        totalOverpaymentAmount: computed.totalOverpaymentAmount.toFixed(2),
        possibleTaxDeduction: computed.possibleTaxDeduction.toFixed(2),
        savingsDueMotherCapital: computed.savingsDueMotherCapital.toFixed(2),
        recommendedIncome: computed.recommendedIncome.toFixed(2),
        paymentSchedule: JSON.stringify(computed.paymentSchedule),
      }).$returningId();

      const calculationId = calculationIds[0]?.id;
      if (!calculationId) {
        throw new Error('Failed to create mortgage calculation');
      }

      return calculationId;
    });
  }

  async findCalculationById(id: number): Promise<MortgageCalculationRecord | null> {
    const [calculation] = await this.db
      .select()
      .from(mortgageCalculation)
      .where(eq(mortgageCalculation.id, id));

    return (calculation as MortgageCalculationRecord | undefined) ?? null;
  }

  private async ensureUserExists(tx: any, userId: string): Promise<void> {
    const [existingUser] = await tx.select().from(users).where(eq(users.tgId, userId));

    if (!existingUser) {
      await tx.insert(users).values({ tgId: userId });
    }
  }
}
