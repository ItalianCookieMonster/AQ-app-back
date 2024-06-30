import axios from "axios";

export const getLatLongFromCity = async (
  city: string,
  weatherAPIKey?: string
): Promise<{ lat: string; long: string }> => {
  const apiKey = weatherAPIKey
    ? weatherAPIKey
    : process.env.OPENWEATHERMAP_API_KEY;

  const response = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
  );

  if (response.status === 401) {
    throw new Error("Invalid API key");
  }

  const { lat, lon } = response.data[0];
  return { lat, long: lon };
};
