import { AcceptableQuestions, UserParams } from "..";
import { callGroqLLama3OpenAI } from "../llms/callGroqLlama3";
import { systemPrompts } from "../llms/prompts";

import fs from "fs";
import path from "path";

// Read the JSON file synchronously and parse it
const dataFilePath = path.join(
  __dirname,
  "../rawData/currentAirSituationRange.json"
);

const jsonDataAirSituation = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

export const questionsHandler = async ({
  question,
  userParams,
  airQualityLevel,
}: {
  question: AcceptableQuestions;
  userParams: UserParams;
  airQualityLevel: number;
}): Promise<string | null> => {
  if (!question || !userParams) {
    return "Missing question or user parameters";
  }

  if (question === "goForARun") {
    return "goForARun" + userParams;
  } else if (question === "whatToDoRn") {
    return "whatToDoRn" + userParams;
  } else if (question === "currentAirSituation") {
    const response = await callGroqLLama3OpenAI({
      systemPrompt: systemPrompts.currentAirSituation,
      prompt: `
        <data>: ${JSON.stringify(jsonDataAirSituation)}
        <age>: ${userParams.age}
        <pm2_5_level>: ${airQualityLevel}
  `,
    });
    console.log(
      "!!!!!!! ~ response call groq lama currentairsituation:",
      response
    );

    return "currentAirSituation " + userParams;
  }

  return null;
};
