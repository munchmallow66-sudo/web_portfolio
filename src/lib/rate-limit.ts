/**
 * In-memory sliding window rate limiter for edge/serverless.
 * Uses a Map keyed by identifier (IP) with timestamps in a rolling window.
 * Safe for single-instance; for multi-instance deployments, replace with Redis.
 */

type RateLimitEntry = {
    timestamps: number[];
};

const store = new Map<string, RateLimitEntry>();

// Clean stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of Array.from(store.entries())) {
        entry.timestamps = entry.timestamps.filter((t: number) => now - t < windowMs);
        if (entry.timestamps.length === 0) {
            store.delete(key);
        }
    }
}

export function rateLimit(
    identifier: string,
    {
        windowMs = 60 * 1000, // 1 minute default
        maxRequests = 30, // 30 requests per window default
    } = {}
): { allowed: boolean; remaining: number; retryAfterMs: number } {
    cleanup(windowMs);

    const now = Date.now();
    const entry = store.get(identifier) || { timestamps: [] };

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

    if (entry.timestamps.length >= maxRequests) {
        const oldestInWindow = entry.timestamps[0];
        const retryAfterMs = windowMs - (now - oldestInWindow);
        store.set(identifier, entry);
        return { allowed: false, remaining: 0, retryAfterMs };
    }

    entry.timestamps.push(now);
    store.set(identifier, entry);

    return {
        allowed: true,
        remaining: maxRequests - entry.timestamps.length,
        retryAfterMs: 0,
    };
}
