import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL);

redis.on("error", (err) => {
    console.log("Redis connection failed:", err.message);
});

redis.on("connect", () => {
    console.log("Redis connected successfully!");
});