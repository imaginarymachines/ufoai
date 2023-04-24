import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { NextResponse } from "next/server";
const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey:process.env.OPENAI_API_KEY,
  timeout: 10
 });
export async function GET(request: Request) {
  //Get prompt from url query args
  const prompt = new URL(request.url).searchParams.get("prompt" ) as string;
  if( !prompt ) {
    return NextResponse.json({
      message: "Missing prompt"
    }, {
      status: 400,
    })
  }
  //Ask the chat model
  const response = await chat.call([
    new SystemChatMessage("You are helpful dog who would like to go for a walk"),
    new HumanChatMessage(prompt),
  ]).catch((error) => {
    console.log(error.message);
    return NextResponse.json({
      message: error.message
    }, {
      status: 400,
    })
  });

  return NextResponse.json(
    {text: response.text}
  );
}
