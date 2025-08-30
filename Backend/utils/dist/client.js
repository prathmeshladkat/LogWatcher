"use strict";
/*import { Kafka, logLevel } from "kafkajs";

console.log("🔧 Initializing Kafka client...");

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

export const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: false,
  transactionTimeout: 30000,
});

export const initKafkaProducer = async () => {
  try {
    console.log("🔌 Attempting to connect to Kafka at localhost:9092...");
    await producer.connect();
    console.log("✅ Kafka producer connected successfully!");
    return true;
  } catch (err) {
    console.error("❌ Failed to connect to Kafka producer:");
    console.error("Error details:", err);

    // Additional debugging info

    throw err;
  }
};

export const produceLogs = async (topic: string, message: any) => {
  try {
    console.log(`📤 Sending message to topic '${topic}'...`);
    const result = await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`✅ Message sent successfully to ${topic}:`, result);
    return result;
  } catch (err) {
    console.error(`❌ Failed to send log to topic '${topic}':`, err);
    throw err;
  }
};

export const closeProducer = async () => {
  try {
    await producer.disconnect();
    console.log("✅ Kafka producer disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting producer:", error);
  }
};*/
