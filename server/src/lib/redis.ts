import Redis from "ioredis"

const redisKey = process.env.REDIS_KEY as string;
let client: Redis;
try {
  client = new Redis(redisKey);
} catch (error) {
  console.error("Error connecting to Redis:", error.message);
}

export default client;