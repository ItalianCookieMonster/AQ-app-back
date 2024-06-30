// Import the OpenAI library
import { OpenAI } from "openai";

export type LLMType = {
  systemPrompt: string;
  prompt: string;
  responseFormat?: "text" | "json";
};

// Function to call OpenAI API and return the response text
export async function callMistralAPI({
  systemPrompt,
  prompt,
  responseFormat = "text",
}: LLMType): Promise<null | { [key: string]: string }> {
  const apiKey = process.env.GROQ_API_KEY;

  // Set up OpenAI API configuration
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  try {
    const response = await openai.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = response?.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Error calling Groq Mistral API:", error);
    throw error; // or handle the error as you see fit
  }
}
