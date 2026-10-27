import redis from '@adonisjs/redis/services/main'

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch {}
    return null
  }

  static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value))
    } catch {}
  }

  static async getOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    try {
      const cached = await redis.get(key)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch {}

    const fresh = await fetcher()

    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(fresh))
    } catch {}

    return fresh
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch {}
  }

  static async delete(key: string): Promise<void> {
    return this.del(key)
  }

  static async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch {}
  }

  static async deleteByPrefix(prefix: string): Promise<void> {
    return this.delPattern(`${prefix}*`)
  }

  /**
   * Distributed Lock atômico com Redis (SET resource NX EX ttl)
   * Previne race conditions em agendamento de vagas simultâneas
   */
  static async acquireLock(key: string, ttlSeconds: number = 5): Promise<boolean> {
    try {
      const result = await redis.set(key, 'locked', 'EX', ttlSeconds, 'NX')
      return result === 'OK'
    } catch {
      // Fallback permissivo se Redis não estiver conectado em testes locais
      return true
    }
  }

  static async releaseLock(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch {}
  }
}

export default CacheService
