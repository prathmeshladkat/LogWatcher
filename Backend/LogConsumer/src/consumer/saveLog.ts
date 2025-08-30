import { esClient } from "../../../utils/dist";

export const saveLog = async (log: any) => {
  try {
    await esClient.index({
      index: "logs",
      document: log,
    });
    console.log("log stored in elasticsearch");
  } catch (err) {
    console.error("❌ Failed to save log:", err);
  }
};
