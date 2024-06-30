import { AcceptableQuestions, AvailableModels, UserParams } from "..";
import { callGroqLLama3OpenAI } from "../llms/callGroqLlama3";
import { callMistralAPI } from "../llms/mistralAI";
import { systemPrompts } from "../llms/prompts";
import { returnRawFileData } from "../rawData/getRawDataHandler";

import { getCurrentDayAndTime } from "../utils/getCurrentDayAndTime";

// goForARun - boolean is good (isGood)
// currentAirSituation - air quality range (currentAirStatus)
// whatToDoRn - id for the area (areaID)

export const questionsHandler = async ({
  question,
  userParams,
  airQualityLevel,
  whatIsUserDoingAtTheMoment,
  model,
}: {
  question: AcceptableQuestions;
  userParams: UserParams;
  airQualityLevel: number;
  whatIsUserDoingAtTheMoment?: string;
  model?: AvailableModels;
}): Promise<{ [key: string]: string } | null> => {
  if (!question || !userParams) {
    return { ouptut: "Missing question or user parameters" };
  }

  const isMistralModel = model === "mistral";

  const currentModelFunction = !isMistralModel
    ? callGroqLLama3OpenAI
    : callMistralAPI;

  if (question === "goForARun") {
    const { day, hour } = getCurrentDayAndTime();

    const jsonDataHealth = await returnRawFileData("jsonDataHealth");

    const response = await currentModelFunction({
      systemPrompt: systemPrompts[question],
      prompt: `
        <health_impact_data>: ${JSON.stringify(jsonDataHealth)}
        <day_of_week>: ${day}
        <time_of_day>: ${hour}
        <pm2_5_level>: ${airQualityLevel}
  `,
      responseFormat: "json",
    });

    return response;
  } else if (question === "whatToDoRn") {
    const jsonDataWhatToDo = await returnRawFileData("jsonDataWhatToDo");

    const response = await currentModelFunction({
      systemPrompt: systemPrompts[question],
      prompt: `
        <examples_data>: ${JSON.stringify(jsonDataWhatToDo)}
        <age>: ${userParams.age}
        <user_is_doing>: ${whatIsUserDoingAtTheMoment}
        <pm2_5_level>: ${airQualityLevel}
  `,
      responseFormat: "json",
    });

    return response;
  } else if (question === "currentAirSituation") {
    const jsonDataAirSituation = await returnRawFileData(
      "jsonDataAirSituation"
    );

    const response = await currentModelFunction({
      systemPrompt: systemPrompts[question],
      prompt: `
        <data>: ${JSON.stringify(jsonDataAirSituation)}
        <age>: ${userParams.age}
        <pm2_5_level>: ${airQualityLevel}
  `,
      responseFormat: "json",
    });

    return response;
  }

  return null;
};
