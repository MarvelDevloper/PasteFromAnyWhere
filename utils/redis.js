import Redis from 'ioredis'

export const redis = new Redis(
    {
        port: 6379, // Redis port
        host: "127.0.0.1", // Redis host
    }
);


redis.on('error', () => {
    console.log('redis connection failed')
})

redis.on('start', () => {
    console.log('redis connected successfully!')
})

