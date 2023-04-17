import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";


const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey:process.env.OPENAI_API_KEY
});

//Generate text based on the current prompt
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
    //insturctions for the chat model
    new SystemChatMessage("You are helful blog post writing assistant"),
    //the prompt
    new HumanChatMessage(prompt),
  ]).catch((error) => {
    console.log(error);
    return new Response(JSON.stringify({error}))
  });

  return new Response(
    JSON.stringify({text:response.text})
  );
}
