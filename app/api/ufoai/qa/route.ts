import { ChatOpenAI } from "langchain/chat_models/openai";
import { NextResponse } from "next/server";
import { askWebsite } from "@/lib/ask";

/**
 * Get a website and ask questions about it
 */
//GET
export async function GET(request: Request) {
    //get question and url from request body
    const searchParams = new URL(request.url).searchParams;
    const question = searchParams.get("question" ) as string;
    const url = searchParams.get("url" ) as string;

    const data = await askWebsite({
        url,
        question,
        model: new ChatOpenAI({
            temperature: 0,
            openAIApiKey:process.env.OPENAI_API_KEY,
        }),
    });

    return NextResponse.json({
        data
    })
}

//POST
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

    return NextResponse.json({
        data
    })
  }
