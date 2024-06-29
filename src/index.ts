import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { getLatLongFromCity } from "./services/getLatLongFromCity";
import { getAirConditionsFromLatLong } from "./services/getAirConditionsFromLatLong";

const app = express();
const port = 4083;

app.use(bodyParser.json());

interface UserParams {
  age: number;
  gender: string;
  hasAsma: boolean;
}

app.post("/get-air-recommendations", (req: Request, res: Response) => {
  const { city, userParams }: { city: string; userParams: UserParams } =
    req.body;

  if (!city || !userParams) {
    return res.status(400).send("Missing city or user parameters");
  }

  const { lat, long } = getLatLongFromCity(city);
  const airQuality = getAirConditionsFromLatLong(lat, long);

  return res.json({
    message: "hello",
    city,
    lat,
    long,
    airQuality,
    userParams,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
