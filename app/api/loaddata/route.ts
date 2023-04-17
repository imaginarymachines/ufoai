import { ask } from "@/lib/ask";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
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
  const response = await ask({ docs, question,llm }).catch((e) => {
    return new Response(JSON.stringify({
      error: e
    }))
  });

  return new Response(
    JSON.stringify({ text: response.text })
  );
}
