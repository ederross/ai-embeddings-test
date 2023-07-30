require("dotenv").config();

import { redis, redisVectoreStore } from "./redis-store";

async function search() {
  redis.connect();

  const response = await redisVectoreStore.similaritySearchWithScore(
    "É parecido com html?",
    5
  );

  console.log(response);
  await redis.disconnect();
}

search();
