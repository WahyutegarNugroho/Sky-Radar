const store = new Map(); export function getClientCache(key) { const entry = store.get(key); if (!entry) return null; if (Date.now()>entry.expiresAt) { store.delete(key); return null; } return entry.data;
} export function setClientCache(key, data, ttlMs = 600000) { store.set(key, { data, expiresAt: Date.now() + ttlMs, });
}
// ponytail: in-memory Map — lost on hard refresh, no offline support. Upgrade to CacheStorage API + Service Worker when offline support is required.
