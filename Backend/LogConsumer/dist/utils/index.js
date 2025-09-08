"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogsIndexOnce = exports.createLogsIndex = exports.closeProducer = exports.produceLogs = exports.initKafkaProducer = exports.producer = exports.esClient = void 0;
const kafkajs_1 = require("kafkajs");
const elasticsearch_1 = require("@elastic/elasticsearch");
console.log("🔧 Initializing Kafka client...");
exports.esClient = new elasticsearch_1.Client({
    node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
    requestTimeout: 60000,
    pingTimeout: 3000,
    maxRetries: 3,
});
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
const initKafkaProducer = async () => {
    try {
        console.log("🔌 Attempting to connect to Kafka at localhost:9092...");
        await exports.producer.connect();
        console.log("✅ Kafka producer connected successfully!");
        return true;
    }
    catch (err) {
        console.error("❌ Failed to connect to Kafka producer:");
        console.error("Error details:", err);
        // Additional debugging info
        throw err;
    }
};
exports.initKafkaProducer = initKafkaProducer;
const produceLogs = async (topic, message) => {
    try {
        console.log(`📤 Sending message to topic '${topic}'...`);
        const result = await exports.producer.send({
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
};
exports.produceLogs = produceLogs;
const closeProducer = async () => {
    try {
        await exports.producer.disconnect();
        console.log("✅ Kafka producer disconnected");
    }
    catch (error) {
        console.error("❌ Error disconnecting producer:", error);
    }
};
exports.closeProducer = closeProducer;
const createLogsIndex = async () => {
    try {
        await exports.esClient.ping();
        console.log("✅ Elasticsearch connection successful");
        const exists = await exports.esClient.indices.exists({ index: "logs" });
        if (!exists) {
            await exports.esClient.indices.create({
                index: "logs",
                settings: {
                    number_of_shards: 1,
                    number_of_replicas: 0, // For development
                    refresh_interval: "1s", // Real-time search
                },
                mappings: {
                    properties: {
                        ip: { type: "ip" },
                        access_time: {
                            type: "date",
                            format: "strict_date_optional_time||epoch_millis",
                        },
                        method: { type: "keyword" },
                        endpoint: { type: "keyword" },
                        protocol: { type: "keyword" },
                        status: { type: "integer" },
                        bytes: { type: "integer" },
                        referrer: { type: "text" },
                        user_agent: { type: "text" },
                        log_time: { type: "date" },
                        log_level: { type: "keyword" },
                        service_name: {
                            type: "text",
                            fields: {
                                keyword: { type: "keyword" }, // For exact matches
                            },
                        },
                        message: {
                            type: "text",
                            analyzer: "standard", // Better for search
                        },
                        request_id: { type: "keyword" },
                    },
                },
            });
            console.log("✅ logs index created with mappings");
        }
        else {
            console.log("ℹ️ logs index already exists, skipping creation");
        }
    }
    catch (error) {
        console.error("elasticsearch fialed to create index:", error);
    }
};
exports.createLogsIndex = createLogsIndex;
//dont call this function ☠️ unless u wnt to change mapping of document
const deleteLogsIndexOnce = async () => {
    try {
        const exists = await exports.esClient.indices.exists({ index: "logs" });
        if (exists) {
            await exports.esClient.indices.delete({ index: "logs" });
            console.log("🗑️ Deleted existing logs index - run this only once!");
        }
        else {
            console.log("ℹ️ logs index doesn't exist");
        }
    }
    catch (error) {
        console.error("❌ Error deleting index:", error);
    }
};
exports.deleteLogsIndexOnce = deleteLogsIndexOnce;
