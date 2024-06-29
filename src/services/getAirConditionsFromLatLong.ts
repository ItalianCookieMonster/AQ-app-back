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
  long: string
): Promise<AirConditions> => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const result = await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${apiKey}`
  );
  return result.data.list[0]?.components || null;
};
