import { BaseLLM } from 'langchain/llms/base';
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";
import { WebBrowser } from "langchain/tools/webbrowser";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseChatModel } from 'langchain/dist/chat_models/base';

/**
 * Ask question about arbitrary documents
 */
export const ask = async ({ docs, question, llm }: {
    docs: Document[],
    question: string,
    llm: BaseLLM
}) => {
    const chain = loadQAStuffChain(llm);
    const res = await chain.call({
        input_documents: docs,
        question,
    });
    return res;
};

/**
 * Ask question about a website
 */
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
