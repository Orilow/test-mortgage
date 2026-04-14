import { decimal, int, mysqlTable, serial, text, varchar } from 'drizzle-orm/mysql-core';
import { users } from '../../user/schemas/users';
import { mortgageProfile } from './mortgage-profile';

export const mortgageCalculation = mysqlTable('MortgageCalculation', {
  id: serial().primaryKey(),
  userId: varchar('userId', { length: 255 })
    .references(() => users.tgId, {
      onDelete: 'restrict'
    })
    .notNull(),
    mortgageProfileId: int('mortgageProfileId').references(() => mortgageProfile.id, {
      onDelete: 'cascade'
    }).notNull(),
    monthlyPayment: decimal('monthlyPayment', { scale: 2 }).notNull(),
    totalPayment: decimal('totalPayment', { scale: 2 }).notNull(),
    totalOverpaymentAmount: decimal('totalOverpaymentAmount', { scale: 2 }).notNull(),
    possibleTaxDeduction: decimal('possibleTaxDeduction', { scale: 2 }).notNull(),
    savingsDueMotherCapital: decimal('savingsDueMotherCapital', { scale: 2 }).notNull(),
    recommendedIncome: decimal('recommendedIncome', { scale: 2 }).notNull(),
    paymentSchedule: text('paymentSchedule').notNull(),
});
