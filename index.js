import OpenAI from 'openai';
import {config} from "dotenv";
import { stdin as input, stdout as output } from 'process';
import { createInterface } from 'readline/promises';
import mongoose from 'mongoose';
import {product, user, convercation} from "./schema/schema.js";
config();

const rl = createInterface({ input, output });

const openai = new OpenAI({
  baseURL: "https://api.a4f.co/v1",
  apiKey: process.env.API_KEY,
});

const getProductData = async () => {
  const products = await product.find();
  const info = products.map(p => {
    return {title : p.title, description : p.productDetails}
  });
  return info;
}

let SYSTEM_PROMPT;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB connected");
        const info = await getProductData();
        SYSTEM_PROMPT = {
          role: "system",
          content: `You are a helpful shopping assistant who always responds in Bangla (Bengali). You have access to the following product information. When a user asks a question, respond only based on this product data. Do not guess or make up answers. If the answer is not available in the product list, politely say in Bangla that the product is not available.

          If the user asks you to create a Facebook post about a product, use the product’s title and description to write a friendly, attractive, and clear Facebook post in Bangla.

          Here is the product information:
          ${JSON.stringify(info)}
        `
        };
        main();
    } catch (error) {
        console.log(error);
    }
}
connectDB();

const connectLLM = async (userID) => {
  const allMessages = await getMessage(userID);
  const messages = [SYSTEM_PROMPT];
  for(let obj of allMessages) {
    messages.push(obj);
  }
  try {
    const completion = await openai.chat.completions.create({
    model: "provider-2/gpt-4o",
    messages
  });
    console.log(completion.choices[0].message.content);
    await saveMessages(completion.choices[0].message, userID);
    ask(userID);
  } catch (error) {
    console.log(error)
  }
}

const ask = async (userID) => {
  const question = await rl.question("You :");
  const userInput = {
    role : "user",
    content : question
  }
  await saveMessages(userInput, userID);
  connectLLM(userID);
}

const main = async () => {
  try {
    const userID = await rl.question("Write User ID :");
    if(userID) {
      const chackUser = await user.findById(userID);
      try {
        if(chackUser) {
        ask(userID);
      }
      } catch (error) {
        console.log(error)
      }
    }
  } catch (error) {
    console.log("User not found! please try agine")
    main();
  }
}

const saveMessages = async (data, userID) => {
  try {
    const message = {...data, userID};
    const newConvercation = new convercation(message);
    await newConvercation.save();
  } catch (error) {
    
  }
}

const getMessage = async (userID) =>{
  const convercations = await convercation.find({userID}).sort({ createdAt: 1 });
  return convercations;
}