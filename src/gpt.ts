require("dotenv").config();

import { PromptTemplate } from "langchain";
import {
  ConversationalRetrievalQAChain,
  RetrievalQAChain,
} from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { redis, redisVectoreStore } from "./redis-store";

const openAIChat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
});

const prompt = new PromptTemplate({
  template: `
  Você responde perguntas sobre programação.
  O usuário está assistindo um vídeo sobre um determinado tópico ou projeto.
  Use o conteúdo das transcrições desse vídeo abaixo para responder perguntas do usuário.
  Se a resposta não for encontrada nas transcrições, responda que você não sabe, não tente inventar uma resposta.

  Se possível, inclua exemplos de código.

  Transcrições: 
  {context}

  Pergunta: 
  {question}
  `.trim(),
  inputVariables: ["context", "question"],
});

// LLM = Large Language Model

const chain = RetrievalQAChain.fromLLM(
  openAIChat,
  redisVectoreStore.asRetriever(),
  {
    prompt,
    returnSourceDocuments: true,
    verbose: true,
  }
);

async function main() {
  await redis.connect();

  const response = await chain.call({
    query: "É parecido com HTML?",
  });

  console.log(response);

  await redis.disconnect();
}

main();
