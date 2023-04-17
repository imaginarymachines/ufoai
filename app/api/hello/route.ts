import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey:process.env.OPENAI_API_KEY
 });
export async function GET(request: Request) {
  //Get prompt from url query args
  const prompt = new URL(request.url).searchParams.get("prompt" ) as string;
  if( !prompt ) {
    return new Response(JSON.stringify({
      status: 400,
      body: "Missing prompt"
    }));
  }
  //Ask the chat model
  const response = await chat.call([
    new HumanChatMessage(prompt),
  ]).catch((error) => {
    console.log(error);
    return new Response(JSON.stringify({error}))
  });

  return new Response(
    JSON.stringify({text:response.text})
  );
}
