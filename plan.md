# API

The idea:

### Zero-shot text generation using ChatGPT
> SEE: https://js.langchain.com/docs/modules/models/chat/

- `/text` Take prompt, output text

### Few-shot using PromptTemplates
> SEE: https://js.langchain.com/docs/modules/prompts/prompt_templates/

- POST `/text/prompt`
    - Send heading, previous paragraphs and keywords
    - This needs to store that as JSON so it can be used
    - And return a JSON {uuid:<the-unique-id>}
- GET `/text/prompt`
    - Send <prompt> and <uuid>
    - Use the saved prompt template to generate text

Needs:
- Database or file system for storing prompt templates

### Injest Data, Use It For Better Responses

You can't expect any of this to be great with out embedding data or fine tune models.

- Use document loaders
    - https://js.langchain.com/docs/modules/indexes/document_loaders/
- Make idexes
- Create chains that write based on preexisting content.
    - https://js.langchain.com/docs/modules/chains/llmchain/
- Write chains that make suggestions to improve content.
- Fine tuning?


## UI

- Chat UI
- UI for crafting blog posts
- Image generation with Replicate


## Authentication/ eCommerce/ Whatever

Ideas
- Make it so you can use your own API Key
    - https://twitter.com/poorlybatched/status/1633854291835506689
    - https://fosstodon.org/@josh412/110005451639412405
- Use existing Laravel app for user auth/ billing
- Use a database
