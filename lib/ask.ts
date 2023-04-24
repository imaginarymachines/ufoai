import { BaseLLM } from 'langchain/llms/base';
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseChatModel } from 'langchain/dist/chat_models/base';
export const ask = async ({ docs, question, llm }: {
    docs: Document[],
    question: string,
    llm: BaseLLM
}) => {
    const chainA = loadQAStuffChain(llm);
    const res = await chainA.call({
        input_documents: docs,
        question,
    });
    return res;
};

export async function askWebsite({
    url,
    question,
    model
}: {
    url: string,
    question: string,
    model: BaseChatModel
}) {
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });

    const result = await browser.call(`"${url}", "${question}"`);

    return result;
}
