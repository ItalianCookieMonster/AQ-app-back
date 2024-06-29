// Import the OpenAI library
import { OpenAI } from "openai";

export type LLMType = {
  systemPrompt: string;
  prompt: string;
};

// Function to call OpenAI API and return the response text
export async function callGroqLLama3OpenAI({
  systemPrompt,
  prompt,
}: LLMType): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  // Set up OpenAI API configuration
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  try {
    const response = await openai.chat.completions.create({
      model: "llama3-70b-8192",
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

    // Return the response text

    return response?.choices[0]?.message?.content?.trim() || "no_response";
  } catch (error) {
    console.error("Error calling Groq Llama 3 API:", error);
    throw error; // or handle the error as you see fit
  }
}
