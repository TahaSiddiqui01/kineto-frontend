import "server-only"
import { createClient, type RedisClientType } from "redis"

declare global {
    // eslint-disable-next-line no-var
    var _redis: RedisClientType | undefined
}

function createRedisClient(): RedisClientType {
    const client = createClient({
        username: process.env.REDIS_USERNAME || "default",
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || "6379"),
            reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
        },
    }) as RedisClientType

    client.on("error", (err) => console.error("[redis] Client error:", err.message))
    client.on("connect", () => console.log("[redis] Connected"))
    client.on("reconnecting", () => console.log("[redis] Reconnecting…"))

    client.connect().catch((err) => console.error("[redis] Initial connect failed:", err.message))

    return client
}

// Reuse client across hot-reloads in development
export const redis: RedisClientType = globalThis._redis ?? createRedisClient()

if (process.env.NODE_ENV !== "production") {
    globalThis._redis = redis
}
