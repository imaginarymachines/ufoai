import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY
});

//Chat API for chat UI
export async function POST(request: Request) {
  //get array of messages from request body
  const messages = await request.json();
  //ensure messages is an array
  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({
      status: 400,
      body: "Messages must be an array"
    }));
  }
  //
  //ensure each item is object with {user, text} properties both are strings
  for (const message of messages) {
    //@todo validate
    //probably use zod or yum though?

  }
  //create array of messages for the chat model
  const chatMessages = messages.map((message: {
    type: 'user' | 'system',
    message: string
  }) => {
    if (message.type === "user") {
      return new HumanChatMessage(message.message);
    } else {
      return new SystemChatMessage(message.message);
    }
  });

  //Ask the chat model
  const response = await chat.call(chatMessages).catch((error) => {
    return new Response(JSON.stringify({
      status: error.status,
      body: error.statusText
    }))
  });

  return new Response(
    JSON.stringify({ text: response.text })
  );
}
