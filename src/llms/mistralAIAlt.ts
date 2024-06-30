import MistralClient from "@mistralai/mistralai";

export type LLMType = {
  systemPrompt: string;
  prompt: string;
  responseFormat?: "text" | "json";
};

// Function to call Mistral API and return the response text
export async function callMistralAPI({
  systemPrompt,
  prompt,
  responseFormat = "text",
}: LLMType): Promise<null | { [key: string]: string }> {
  const apiKey = process.env.MISTRAL_API_KEY;
  const client = new MistralClient(apiKey);

  try {
    const chatResponse = await client.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = chatResponse.choices[0].message.content;
    return content
      ? responseFormat === "json"
        ? JSON.parse(content)
        : { text: content }
      : null;
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    throw error; // or handle the error as you see fit
  }
}
