require("dotenv").config();

import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "redis";

export const redis = createClient({
  url: "redis://127.0.0.1:6379",
});

export const redisVectoreStore = new RedisVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    indexName: "videos-embeddings",
    redisClient: redis,
    keyPrefix: "videos:",
  }
);
