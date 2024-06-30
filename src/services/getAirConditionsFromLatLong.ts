import axios from "axios";

type AirConditions = {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
  dt: number;
};

export const getAirConditionsFromLatLong = async (
  lat: string,
  long: string,
  weatherAPIKey?: string
): Promise<AirConditions> => {
  const apiKey = weatherAPIKey
    ? weatherAPIKey
    : process.env.OPENWEATHERMAP_API_KEY;

  const response = await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${apiKey}`
  );
  if (response.status === 401) {
    throw new Error("Invalid API key");
  }

  return response.data.list[0]?.components || null;
};
