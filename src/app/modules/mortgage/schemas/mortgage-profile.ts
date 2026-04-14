import {
  boolean,
  decimal,
  index,
  int,
  mysqlTable,
  serial,
  varchar
} from 'drizzle-orm/mysql-core';
import { users } from '../../user/schemas/users';

//вообще принято именовать в snake_case, но для консистентности с Users - оставляем так
export const mortgageProfile = mysqlTable('MortgageProfile', {
  id: serial().primaryKey(),
  userId: varchar('userId', { length: 255 })
    .references(() => users.tgId, {
      // зависит от правил бизнеса (хотим/не хотим сохранять данные) - пока упростим себе задачу для MVP
      onDelete: 'restrict'
    })
    .notNull(),
  propertyPrice: decimal('propertyPrice', { scale: 2 }).notNull(),
  propertyType: varchar('propertyType', {
    enum: [
      'apartment_in_new_building',
      'apartment_in_secondary_building',
      'house',
      'house_with_land_plot',
      'land_plot',
      'other'
    ],
    length: 50
  }).notNull(),
  downPaymentAmount: decimal('downPaymentAmount', { scale: 2 }).notNull(),
  matCapitalAmount: decimal('matCapitalAmount', { scale: 2 }),
  matCapitalIncluded: boolean('matCapitalIncluded').notNull(),
  mortgageTermYears: int('mortgageTermYears').notNull(),
  interestRate: decimal('interestRate', { scale: 3 }).notNull()
},
  table => [index('mortgage_profile_user_id_idx').on(table.userId)]
);
