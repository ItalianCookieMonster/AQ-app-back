import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { getLatLongFromCity } from "./services/getLatLongFromCity";
import { getAirConditionsFromLatLong } from "./services/getAirConditionsFromLatLong";

const app = express();
dotenv.config();
const port = 4083;

app.use(bodyParser.json());

interface UserParams {
  age: number;
  isActive: string;
  hasAsma: boolean;
}

type AcceptableQuestions = "goForARun" | "whatToDoRn" | "currentAirSituation";

app.post("/get-air-recommendations", async (req: Request, res: Response) => {
  try {
    const {
      city,
      userParams,
      question,
    }: { city: string; userParams: UserParams; question: AcceptableQuestions } =
      req.body;

    if (!city || !userParams) {
      return res.status(400).send("Missing city or user parameters");
    }

    const { lat, long } = await getLatLongFromCity(city);
    console.log("!!! LATLONGOUTPUT ", { lat, long });

    if (!lat || !long) {
      return res.status(400).send("Missing latitude or longitude");
    }

    const airConditionsResponse = await getAirConditionsFromLatLong(lat, long);
    const airConditionsData = JSON.stringify(airConditionsResponse);

    const pm2_5 = airConditionsResponse
      ? airConditionsResponse.pm2_5
      : "unknown";

    console.log("!!! AIRCONDITIONS OUTPUT", airConditionsData);

    return res.json({
      city,
      lat,
      long,
      // airConditions,
      userParams,
    });
  } catch (error) {
    console.log("!!!!!!! ~ app.post ~ error:", error);
    return res.status(400).send(`Error: ${error}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
