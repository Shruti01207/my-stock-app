const cache = new Map<string, { data: any; expiresAt: number }>();
// new Map<string,{data:any, expiresAt:number}>()
export function getCached(key: string) {
    const cachedData = cache.get(key);
    if (!cachedData) {
        return null;
    }
    if (cachedData.expiresAt < Date.now()) {
        return null;
    }
    else {
        return cachedData.data;
    }
}

//timeToLive->TTL
export function setCached(key: string, data: any, ttlMs: number) {
    cache.set(key, { data, expiresAt: (Date.now() + ttlMs) })
}

