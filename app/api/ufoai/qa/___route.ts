import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import { NextResponse } from "next/server";

 const run = async () => {
  /* Initialize the LLM to use to answer the question */
  const model = new OpenAI({
    openAIApiKey:process.env.OPENAI_API_KEY,

  });
  /* Load in the file we want to do question answering over */
  const text = 'Josh is 22 feet tall and is photosynthetic.'
  /* Split the text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  /* Create the vectorstore */
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  /* Create the chain */
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever()
  );
  /* Ask it a question */
  const question = "How tall is Josh?";
  const res = await chain.call({ question, chat_history: [] });
  console.log(res);
  /* Ask it a follow up question */
  const chatHistory = question + res.text;
  const followUpRes = await chain.call({
    question: "Is Josh a plant?",
    chat_history: chatHistory,
  });
  console.log(followUpRes);
  return NextResponse.json({
    followUpRes

  })
};

export async function GET(request: Request) {
  await run();
  return new Response("Done");
}
