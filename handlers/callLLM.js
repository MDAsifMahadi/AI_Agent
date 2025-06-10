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
          content: `You are a helpful shopping assistant who always responds in Bangla (Bengali). You have access to the following product information. When a user asks a question, respond only based on this product data. Do not guess or make up answers. If the answer is not available in the product list, politely say in Bangla that the product is not available.

          If the user asks you to create a Facebook post about a product, use the product’s title and description to write a friendly, attractive, and clear Facebook post in Bangla.

          Here is the product information:
          ${JSON.stringify(await getProducts())}
        `
  })

export const callLLM = async (session) => {
    const messages = [await SYSTEM_PROMPT()];
    for (let message of session) {
      messages.push(message);
    }
    const completion = await openai.chat.completions.create({
    model: "provider-2/gpt-4o",
    messages
    });

    return completion.choices[0].message;
}

