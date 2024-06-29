import fs from "fs";
import path from "path";

// Read the JSON file synchronously and parse it
const dataFilePathAirSituation = path.join(
  __dirname,
  "../rawData/currentAirSituationRange.json"
);
const dataFilePathHealthImpact = path.join(
  __dirname,
  "../rawData/healthImpactData.json"
);
const dataFilePathWhatToDoExamples = path.join(
  __dirname,
  "../rawData/whatToDoToImproveAirQuality.json"
);

const jsonDataAirSituation = JSON.parse(
  fs.readFileSync(dataFilePathAirSituation, "utf-8")
);
const jsonDataHealth = JSON.parse(
  fs.readFileSync(dataFilePathHealthImpact, "utf-8")
);
const jsonDataWhatToDo = JSON.parse(
  fs.readFileSync(dataFilePathWhatToDoExamples, "utf-8")
);

export const returnRawFileData = async (
  id: "jsonDataHealth" | "jsonDataWhatToDo" | "jsonDataAirSituation"
) => {
  if (!id) {
    return null;
  }

  if (id === "jsonDataHealth") {
    return jsonDataHealth;
  } else if (id === "jsonDataWhatToDo") {
    return jsonDataWhatToDo;
  } else if (id === "jsonDataAirSituation") {
    return jsonDataAirSituation;
  } else {
    return null;
  }
};
