import { AcceptableQuestions, UserParams } from "..";
import { callGroqLLama3OpenAI } from "../llms/callGroqLlama3";
import { systemPrompts } from "../llms/prompts";

import fs from "fs";
import path from "path";
import { getCurrentDayAndTime } from "../utils/getCurrentDayAndTime";

// Read the JSON file synchronously and parse it
const dataFilePathAirSituation = path.join(
  __dirname,
  "../rawData/currentAirSituationRange.json"
);
const dataFilePathHealthImpact = path.join(
  __dirname,
  "../rawData/healthImpactData.json"
);

const jsonDataAirSituation = JSON.parse(
  fs.readFileSync(dataFilePathAirSituation, "utf-8")
);
const jsonDataHealth = JSON.parse(
  fs.readFileSync(dataFilePathHealthImpact, "utf-8")
);

export const questionsHandler = async ({
  question,
  userParams,
  airQualityLevel,
}: {
  question: AcceptableQuestions;
  userParams: UserParams;
  airQualityLevel: number;
  whatIsUserDoingAtTheMoment?: string;
}): Promise<string | null> => {
  if (!question || !userParams) {
    return "Missing question or user parameters";
  }

  if (question === "goForARun") {
    const { day, hour } = getCurrentDayAndTime();

    const response = await callGroqLLama3OpenAI({
      systemPrompt: systemPrompts[question],
      prompt: `
        <health_impact_data>: ${JSON.stringify(jsonDataHealth)}
        <day_of_week>: ${day}
        <time_of_day>: ${hour}
        <pm2_5_level>: ${airQualityLevel}
  `,
      responseFormat: "json",
    });
    console.log("!!!!!!! ~ response call groq lama goforarun:", response);

    const { output } = response || {};

    return output;
  } else if (question === "whatToDoRn") {
    return "whatToDoRn" + userParams;
  } else if (question === "currentAirSituation") {
    const response = await callGroqLLama3OpenAI({
      systemPrompt: systemPrompts[question],
      prompt: `
        <data>: ${JSON.stringify(jsonDataAirSituation)}
        <age>: ${userParams.age}
        <pm2_5_level>: ${airQualityLevel}
  `,
      responseFormat: "json",
    });
    console.log(
      "!!!!!!! ~ response call groq lama currentairsituation:",
      response
    );

    const { currentAirSituation } = response || {};

    return currentAirSituation;
  }

  return null;
};
