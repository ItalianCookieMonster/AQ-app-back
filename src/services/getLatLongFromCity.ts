import axios from "axios";

export const getLatLongFromCity = async (
  city: string
): Promise<{ lat: string; long: string }> => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  const response = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
  );
  const { lat, lon } = response.data[0];
  return { lat, long: lon };
};
