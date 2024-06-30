import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import { getLatLongFromCity } from "./services/getLatLongFromCity";
import { getAirConditionsFromLatLong } from "./services/getAirConditionsFromLatLong";
import { questionsHandler } from "./services/questionsHandler";

const app = express();
dotenv.config();
const port = 4083;

app.use(cors());
app.use(bodyParser.json());

export interface UserParams {
  age: number;
  isActive: string;
  hasAsma: boolean;
}

// problema / quien somos / como lo hemos arreglado / stack usado

// - Is it a good time to go for a run
// - Current air situation for me at the moment
// - What can i do to make the air situation better for me right now - ask what the user is doing right now
// - Tell me the current air condition

export type AcceptableQuestions =
  | "goForARun"
  | "whatToDoRn"
  | "currentAirSituation"; //whatToDoRn - ask what is the user doing

export type AvailableModels = "llama" | "mistral";

app.post("/get-air-recommendations", async (req: Request, res: Response) => {
  try {
    const {
      city,
      userParams,
      question,
      whatIsUserDoingAtTheMoment,
      model = "llama",
    }: {
      city: string;
      userParams: UserParams;
      question: AcceptableQuestions;
      whatIsUserDoingAtTheMoment?: string;
      model?: AvailableModels;
    } = req.body;

    if (!city || !userParams) {
      return res.status(400).send("Missing city or user parameters");
    }

    // const { lat, long } = await getLatLongFromCity(city);
    // console.log("!!! LATLONGOUTPUT ", { lat, long });

    // if (!lat || !long) {
    //   return res.status(400).send("Missing latitude or longitude");
    // }

    // const airConditionsResponse = await getAirConditionsFromLatLong(lat, long);
    // const airConditionsData = JSON.stringify(airConditionsResponse);

    // const pm2_5 = airConditionsResponse
    //   ? airConditionsResponse.pm2_5
    //   : "unknown";

    // console.log("!!! AIRCONDITIONS OUTPUT", airConditionsData);

    const hardCodedPM2_5 = 6.46;

    const questionOutput = await questionsHandler({
      question,
      userParams,
      airQualityLevel: hardCodedPM2_5,
      whatIsUserDoingAtTheMoment,
      model,
    });

    return res.json({
      city,
      pm2_5: hardCodedPM2_5,
      userParams,
      question,
      questionOutput,
    });
  } catch (error) {
    console.log("!!!!!!! ~ app.post ~ error:", error);
    return res.status(400).send(`Error: ${error}`);
  }
});
app.post(
  "/get-air-recommendations-externally",
  async (req: Request, res: Response) => {
    try {
      const {
        city,
        userParams,
        question,
        whatIsUserDoingAtTheMoment,
        weatherAPIKey,
      }: {
        city: string;
        userParams: UserParams;
        question: AcceptableQuestions;
        weatherAPIKey: string;
        whatIsUserDoingAtTheMoment?: string;
      } = req.body;

      if (!city || !userParams) {
        return res.status(400).send("Missing city or user parameters");
      }

      if (!weatherAPIKey) {
        return res.status(400).send("Missing weather API key");
      }

      const { lat, long } = await getLatLongFromCity(city, weatherAPIKey);

      if (!lat || !long) {
        return res.status(400).send("Missing latitude or longitude");
      }

      const airConditionsResponse = await getAirConditionsFromLatLong(
        lat,
        long,
        weatherAPIKey
      );

      const pm2_5 = airConditionsResponse ? airConditionsResponse.pm2_5 : 0.0;

      const questionOutput = await questionsHandler({
        question,
        userParams,
        airQualityLevel: pm2_5,
        whatIsUserDoingAtTheMoment,
      });

      return res.json({
        city,
        pm2_5: pm2_5,
        userParams,
        question,
        questionOutput,
      });
    } catch (error) {
      console.log("!!!!!!! SERVER ~ app.post ~ error:", error);
      return res.status(400).send(`Error: ${error}`);
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
