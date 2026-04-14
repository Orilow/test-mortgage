import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_BASE_TOKEN } from 'src/infrastructure/redis';

@Injectable()
export class MortgageCacheService {
  private static readonly READY_TTL_SECONDS = 60 * 60;

  constructor(@Inject(REDIS_BASE_TOKEN) private readonly redis: Redis) {}

  async getCalculationIdByHash(inputHash: string): Promise<string | null> {
    try {
      await this.ensureConnected();
      return this.redis.get(this.getReadyKey(inputHash));
    } catch {
      return null;
    }
  }

  async setCalculationIdByHash(inputHash: string, id: number): Promise<void> {
    try {
      await this.ensureConnected();
      await this.redis.set(
        this.getReadyKey(inputHash),
        id.toString(),
        'EX',
        MortgageCacheService.READY_TTL_SECONDS
      );
    } catch (error) {
      // логгирование в observability системах
      console.error('Error setting calculation id by hash:', error);
    }
  }

  async getCalculationPayloadById(id: number): Promise<string | null> {
    try {
      await this.ensureConnected();
      return this.redis.get(this.getByIdKey(id));
    } catch (error) {
      // логгирование в observability системах
      console.error('Error setting calculation id by hash:', error);
      return null;
    }
  }

  async setCalculationPayloadById(id: number, payload: string): Promise<void> {
    try {
      await this.ensureConnected();
      await this.redis.set(
        this.getByIdKey(id),
        payload,
        'EX',
        MortgageCacheService.READY_TTL_SECONDS
      );
    } catch (error) {
      // логгирование в observability системах
      console.error('Error setting calculation id by hash:', error);
    }
  }

  private async ensureConnected(): Promise<void> {
    if (this.redis.status === 'ready' || this.redis.status === 'connecting') {
      return;
    }

    await this.redis.connect();
  }

  private getReadyKey(hash: string): string {
    return `mortgage:ready:${hash}`;
  }

  private getByIdKey(id: number): string {
    return `mortgage:id:${id}`;
  }
}
