import { redisClient } from "../config/redis";

export async function cacheChunks(chunks: any[], parentId: string) {
    for (const chunk of chunks) {
        await redisClient.set(`room:${chunk.id}`, JSON.stringify(chunk));
    }
    await redisClient.set(`room:${parentId}:chunks`, JSON.stringify(chunks.map(c => c.id)));
}