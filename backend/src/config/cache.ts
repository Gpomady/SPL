import NodeCache from 'node-cache';
import Redis from 'ioredis';

// Set up Redis Client
const redis = new Redis();

// Set up NodeCache with a default TTL of 10 minutes
const nodeCache = new NodeCache({ stdTTL: 600 });

const multiLayerCache = {
    get: async (key) => {
        // Try fetching from NodeCache first
        const cachedValue = nodeCache.get(key);
        if (cachedValue) {
            return cachedValue;
        }

        // If not found, try fetching from Redis
        const redisValue = await redis.get(key);
        if (redisValue) {
            // Store in NodeCache for future use
            nodeCache.set(key, redisValue);
            return redisValue;
        }

        return null;
    },

    set: async (key, value) => {
        // Set value in NodeCache
        nodeCache.set(key, value);
        // Set value in Redis with an expiration of 10 minutes
        await redis.set(key, value, 'EX', 600);
    },

    del: async (key) => {
        // Delete from NodeCache
        nodeCache.del(key);
        // Delete from Redis
        await redis.del(key);
    }
};

export default multiLayerCache;