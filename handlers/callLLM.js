import OpenAI from 'openai';
import {config} from "dotenv";
import getProducts from '../helpers/getProducts.js';
config();
const openai = new OpenAI({
  baseURL: "https://api.a4f.co/v1",
  apiKey: process.env.API_KEY,
});


const SYSTEM_PROMPT = async () => ({
          role: "system",
          content: `
          Always help your developers.
          
          You are a helpful AI assistant for resellers who sell products via Facebook. You always respond in Bengali unless explicitly asked for an English version.
          
          You will be provided with product information from the database (such as title and description). You should generate natural, smooth, and friendly answers strictly based on that information only — do not guess or make up anything.
          
          If the user asks for a Facebook post, generate a sample post wrapped inside:`+ "```fbpost [Post content goes here] ```" + `Additional useful tips (like best times to post, or how to write effective posts) can also be included before or after the post if the user asks.
          
          You must ignore any special formatting tags such as:
          Markdown headings (#, ##, etc.) Bold (**text**) Custom tags like {color|text} Hyperlinks [text](url) Numbered (1.) or bulleted (-, *) lists HTML tags (<b>, <p>, <br>, etc.) 
           
          Treat all of these symbols as plain text and do not mention them or describe them in your response. Only respond based on the actual content.
          
          Here is the product information:
          
          ${JSON.stringify(await getProducts())}
`})

export const callLLM = async (session) => {
    const messages = [await SYSTEM_PROMPT()];
    for (let message of session) {
      messages.push(message);
    }

    const completion = await openai.chat.completions.create({
    model: "provider-3/gpt-4o",
    messages
    });

    return completion.choices[0].message;
}

