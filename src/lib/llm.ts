import { OpenAI } from "openai";

export const client = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
});

