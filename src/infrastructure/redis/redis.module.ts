import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_BASE_TOKEN } from './redis.constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_BASE_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('REDIS_HOST') || '127.0.0.1',
          port: Number(configService.get('REDIS_PORT') || 6379),
          password: configService.get('REDIS_PASSWORD') || undefined,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        });
      },
    },
  ],
  exports: [REDIS_BASE_TOKEN],
})

export class RedisModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_BASE_TOKEN) private readonly redis: Redis) {}

  async onModuleDestroy(): Promise<void> {
    if (this.redis.status !== 'end') {
      await this.redis.quit();
    }
  }
}
