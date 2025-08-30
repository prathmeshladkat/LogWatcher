import { Kafka, logLevel } from "kafkajs";
import { parsedCombinedLog } from "../handler/logParser";

const kafka = new Kafka({
  clientId: "log-watcher",
  brokers: ["localhost:9092"],
  logLevel: logLevel.INFO, // Add logging to see what's happening
  connectionTimeout: 3000,
  requestTimeout: 25000,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consumer = kafka.consumer({ groupId: "Logs-group" });

export const initLogsConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({ topic: "logs", fromBeginning: false });

  console.log("✅subscribed to logs topic");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) {
        console.warn("Empty message received. skipping...");
        return;
      }

      let logLine;
      try {
        logLine = JSON.parse(message.value.toString());
      } catch (err) {
        console.error("Invalid JSON in message:", err);
        return;
      }

      try {
        if (topic === "logs") {
          console.log("handling logs message");
          await parsedCombinedLog(logLine);
        }
      } catch (err) {
        console.error("Error handling message for topic", err);
      }
    },
  });
};
