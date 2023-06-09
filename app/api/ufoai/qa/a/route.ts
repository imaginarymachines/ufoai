import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";

//This was a test, probably delete
 const handler = async () => {
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
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());
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
    text:followUpRes.text
  })
};

export async function GET(request: Request) {
  return await handler();
}
