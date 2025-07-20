import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('error', (err: Error) => console.error('Redis Error:', err));

(async () => {
    await redisClient.connect();
})();
