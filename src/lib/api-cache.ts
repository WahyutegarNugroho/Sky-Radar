interface CacheEntry { data: unknown; expiresAt: number;
} const cache = new Map<string, CacheEntry>(); export function getServerCache(key: string): unknown | null { const entry = cache.get(key); if (!entry) return null; if (Date.now()>entry.expiresAt) { cache.delete(key); return null; } return entry.data;
} export function setServerCache(key: string, data: unknown, ttlSeconds = 60): void { cache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000, });
}
// ponytail: in-memory Map — lost on restart, no multi-instance sharing. Upgrade to Redis/Valkey (@upstash/redis) when deploying multiple replicas or needing persistence.
