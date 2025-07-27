import { Request, Response } from "express";
import * as fs from "fs";
import { chunkifyObject } from "../utilities/chunkify";
import { cacheChunks } from "../utilities/cacheChunks";
import { redisClient } from "../config/redis";

const roomsData = JSON.parse(fs.readFileSync("./src/assets/data/finalData.json", "utf8"));

export const retrieveController = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const query = q.toLowerCase();
    const room = roomsData.find((r: any) => r.name.toLowerCase() === query);
    if (!room) {
        return res.status(404).json({ error: `Room with name "${q}" not found` });
    }

    let chunks: any[] = [];

    const cachedChunkIds = await redisClient.get(`room:${room.id}:chunks`);
    if (cachedChunkIds) {
        const chunkIds = JSON.parse(cachedChunkIds);
        for (const chunkId of chunkIds) {
            const cachedChunk = await redisClient.get(`room:${chunkId}`);
            if (cachedChunk) chunks.push(JSON.parse(cachedChunk));
        }
    }

    if (chunks.length === 0) {
        if (room.token_count > 100) {
            chunks = chunkifyObject(room, room.id);
            await cacheChunks(chunks, room.id);
        } else {
            chunks = [{ ...room }];
            await redisClient.set(`room:${room.id}`, JSON.stringify(room));
            await redisClient.set(`room:${room.id}:chunks`, JSON.stringify([room.id]));
        }
    }

    res.json({ total_chunks: chunks.length, chunks });
};
