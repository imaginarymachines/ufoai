import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";

export const ask = async ({ docs, question }: {
  docs: Document[],
  question: string
}) => {
  const llmA = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const chainA = loadQAStuffChain(llmA);
  const res = await chainA.call({
    input_documents: docs,
    question,
  });
  return res;
};
export async function GET(request: Request) {

  const url = new URL(request.url);
  const question = url.searchParams.get("question") as string;
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const branch = url.searchParams.get("branch") as string || 'main';
  const loader = new GithubRepoLoader(
    `https://github.com/${owner}/${repo}`,
    { branch, recursive: false, unknown: "warn", accessToken: process.env.GITHUB_ACCESS_TOKEN }
  );
  const docs = await loader.load();
  const response = await ask({ docs, question }).catch((e) => {
    return new Response(JSON.stringify({
      error: e
    }))
  });

  return new Response(
    JSON.stringify({ text: response.text })
  );
}
