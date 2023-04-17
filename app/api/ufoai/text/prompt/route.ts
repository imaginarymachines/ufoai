import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
    FewShotPromptTemplate,
  } from "langchain/prompts";
const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey:process.env.OPENAI_API_KEY
 });

 const createTemplate = ({heading, text}: {heading: string, text: string[],keywords?:string[]}) => {
    const template = 'Please write the next paragraph under the heading: {heading}';
    const examplePrompt = new PromptTemplate({ template, inputVariables: ["heading"] });
    //make object with {paragraph: text}
    const examples = text.map((t) => ({ paragraph: t }));
    // Finally, we create the `FewShotPromptTemplate`
    const fewShotPrompt = new FewShotPromptTemplate({
        examples,
        examplePrompt,
        /* The prefix is some text that goes before the examples in the prompt. Usually, this consists of intructions. */
        prefix: "Write the paragraph that comes next to the following heading:\n\n{heading}\n\n",
        /* The suffix is some text that goes after the examples in the prompt. Usually, this is where the user input will go */
        suffix: '.\n\n',
        /* The input variables are the variables that the overall prompt expects. */
        inputVariables: ["heading"],
        /* The example_separator is the string we will use to join the prefix, examples, and suffix together with. */
        exampleSeparator: "\n\n",
        /* The template format is the formatting method to use for the template. Should usually be f-string. */
        templateFormat: "f-string",
    });
    return fewShotPrompt;
 }


/**
 * This route:
 * POST: creates a prompt template based on the current post
 * GET: Uses the current template to generate text
 */

//Create a PromptTemplate based on the current POST
//return a uuid for the template
export async function POST(request: Request) {
    //Request should have title (string), text (string[]), and optional keywords (string[])

    let {title, text, keywords} = await request.json();
    if( !title || !text ) {
        return new Response(JSON.stringify({
            status: 400,
            body: "Missing title or text"
        }));
    }
    if (!Array.isArray(keywords)){
        keywords = [];
    }
    if (!Array.isArray(text)){
        text = [text];
    }
    //generate a UUID
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //create a template
    const template = createTemplate({heading: title, text, keywords});
    //store the template
    //how? probably as JSON that's used to init template
    //return the uuid
    return new Response(
        JSON.stringify({uuid})
    );
}

//Use current template to generate text
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
