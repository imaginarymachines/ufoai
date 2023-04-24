import { ChatOpenAI } from "langchain/chat_models/openai";
import { NextResponse } from "next/server";
import { askWebsite } from "@/lib/ask";


export async function POST(request: Request) {
    //get question and url from request body
    const { question, url } = await request.json();
    const data = await askWebsite({
        url,
        question,
        model: new ChatOpenAI({
            temperature: 0,
            openAIApiKey:process.env.OPENAI_API_KEY,
        }),
    });
    console.log({data});

    return NextResponse.json({
        data
    })
  }
