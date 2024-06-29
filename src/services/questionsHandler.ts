import { AcceptableQuestions, UserParams } from "..";
import { callGroqLLama3OpenAI } from "../llms/callGroqLlama3";
import { systemPrompts } from "../llms/prompts";
import { returnRawFileData } from "../rawData/getRawDataHandler";

import { getCurrentDayAndTime } from "../utils/getCurrentDayAndTime";

// run - boolean is good
// air - air quality range
// what to do - id for the area

export const questionsHandler = async ({
  question,
  userParams,
  airQualityLevel,
  whatIsUserDoingAtTheMoment,
}: {
  question: AcceptableQuestions;
  userParams: UserParams;
  airQualityLevel: number;
  whatIsUserDoingAtTheMoment?: string;
}): Promise<{ [key: string]: string } | null> => {
  if (!question || !userParams) {
    return { ouptut: "Missing question or user parameters" };
  }

  if (question === "goForARun") {
    const { day, hour } = getCurrentDayAndTime();

    const jsonDataHealth = await returnRawFileData("jsonDataHealth");

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

    return response;
  } else if (question === "whatToDoRn") {
    const jsonDataWhatToDo = await returnRawFileData("jsonDataWhatToDo");

    const response = await callGroqLLama3OpenAI({
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

    const response = await callGroqLLama3OpenAI({
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
