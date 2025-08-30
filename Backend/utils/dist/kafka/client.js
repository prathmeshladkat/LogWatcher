"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeProducer = exports.produceLogs = exports.initKafkaProducer = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
console.log("🔧 Initializing Kafka client...");
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
exports.producer = kafka.producer({
    maxInFlightRequests: 1,
    idempotent: false,
    transactionTimeout: 30000,
});
const initKafkaProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🔌 Attempting to connect to Kafka at localhost:9092...");
        yield exports.producer.connect();
        console.log("✅ Kafka producer connected successfully!");
        return true;
    }
    catch (err) {
        console.error("❌ Failed to connect to Kafka producer:");
        console.error("Error details:", err);
        // Additional debugging info
        throw err;
    }
});
exports.initKafkaProducer = initKafkaProducer;
const produceLogs = (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 Sending message to topic '${topic}'...`);
        const result = yield exports.producer.send({
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
    }
    catch (err) {
        console.error(`❌ Failed to send log to topic '${topic}':`, err);
        throw err;
    }
});
exports.produceLogs = produceLogs;
const closeProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.producer.disconnect();
        console.log("✅ Kafka producer disconnected");
    }
    catch (error) {
        console.error("❌ Error disconnecting producer:", error);
    }
});
exports.closeProducer = closeProducer;
