import { mortgageProfile } from 'src/mortgage/schemas';
import { users } from '../app/modules/user/schemas/users';
import { MySql2Database } from 'drizzle-orm/mysql2';

export const databaseSchema = {
  users,
  mortgageProfile
} as const;

export type Database = MySql2Database<typeof databaseSchema>;
