import { BaseLLM } from 'langchain/llms/base';
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";
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
