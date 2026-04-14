import {
  decimal,
  index,
  int,
  mysqlTable,
  serial,
  text,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core';
import { users } from '../../user/schemas/users';
import { mortgageProfile } from './mortgage-profile';

export const mortgageCalculation = mysqlTable(
  'MortgageCalculation',
  {
    id: serial().primaryKey(),
    userId: varchar('userId', { length: 255 })
      .references(() => users.tgId, {
        onDelete: 'restrict'
      })
      .notNull(),
    mortgageProfileId: int('mortgageProfileId')
      .references(() => mortgageProfile.id, {
        onDelete: 'cascade'
      })
      .notNull(),
    inputHash: varchar('inputHash', { length: 64 }).notNull(),
    status: varchar('status', {
      length: 20,
      enum: ['pending', 'ready', 'failed']
    })
      .notNull()
      .default('pending'),
    errorMessage: text('errorMessage'),
    monthlyPayment: decimal('monthlyPayment', { scale: 2 }).notNull(),
    totalPayment: decimal('totalPayment', { scale: 2 }).notNull(),
    totalOverpaymentAmount: decimal('totalOverpaymentAmount', {
      scale: 2
    }).notNull(),
    possibleTaxDeduction: decimal('possibleTaxDeduction', {
      scale: 2
    }).notNull(),
    savingsDueMotherCapital: decimal('savingsDueMotherCapital', {
      scale: 2
    }).notNull(),
    recommendedIncome: decimal('recommendedIncome', { scale: 2 }).notNull(),
    paymentSchedule: text('paymentSchedule').notNull()
  },
  table => [
    uniqueIndex('mortgage_calculation_input_hash_idx').on(table.inputHash),
    index('mortgage_calculation_user_id_status_idx').on(
      table.userId,
      table.status
    ),
    index('mortgage_calculation_profile_id_idx').on(table.mortgageProfileId)
  ]
);
