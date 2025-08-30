"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogsConsumer = void 0;
const kafkajs_1 = require("kafkajs");
const logParser_1 = require("../handler/logParser");
const kafka = new kafkajs_1.Kafka({
    clientId: "log-watcher",
    brokers: ["localhost:9092"],
    logLevel: kafkajs_1.logLevel.INFO, // Add logging to see what's happening
    connectionTimeout: 3000,
    requestTimeout: 25000,
    retry: {
        initialRetryTime: 100,
        retries: 8,
    },
});
const consumer = kafka.consumer({ groupId: "Logs-group" });
const initLogsConsumer = async () => {
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
            }
            catch (err) {
                console.error("Invalid JSON in message:", err);
                return;
            }
            try {
                if (topic === "logs") {
                    console.log("handling logs message");
                    await (0, logParser_1.parsedCombinedLog)(logLine);
                }
            }
            catch (err) {
                console.error("Error handling message for topic", err);
            }
        },
    });
};
exports.initLogsConsumer = initLogsConsumer;
