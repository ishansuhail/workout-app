import { OpenAI } from "openai";

export const aiClient = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
});

