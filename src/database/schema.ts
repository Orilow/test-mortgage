import {
  mortgageCalculation,
  mortgageProfile
} from '../app/modules/mortgage/schemas';
import { users } from '../app/modules/user/schemas/users';
import { MySql2Database } from 'drizzle-orm/mysql2';

export { mortgageCalculation, mortgageProfile } from '../app/modules/mortgage/schemas';
export { users } from '../app/modules/user/schemas/users';

export const databaseSchema = {
  users,
  mortgageProfile,
  mortgageCalculation
} as const;

export type Database = MySql2Database<typeof databaseSchema>;
