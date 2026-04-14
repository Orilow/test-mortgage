import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { Database } from './schema';
import { DATABASE_CONSTANTS, DATABASE_TOKEN } from './constants';
import { databaseSchema } from './schema';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: DATABASE_TOKEN,
            useFactory: async (configService: ConfigService): Promise<Database> => {
                const connection = mysql.createPool({
                    host: configService.getOrThrow<string>('HOST'),
                    port: parseInt(configService.getOrThrow<string>('PORT'), 10),
                    user: configService.getOrThrow<string>('USERNAME'),
                    password: configService.get('PASSWORD') || undefined,
                    database: configService.getOrThrow<string>('DATABASE'),
                    timezone: DATABASE_CONSTANTS.DEFAULT_TIMEZONE,
                    dateStrings: true,
                });

                return drizzle(connection, {
                    schema: databaseSchema,
                    mode: 'default'
                }) as Database;
            },
            inject: [ConfigService],
        },
    ],
    exports: [DATABASE_TOKEN],
})
export class DatabaseModule { } 