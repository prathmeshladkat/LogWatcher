"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.getKafkaStatus = exports.isKafkaConnected = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./auth/config/passport"));
const authRoutes_1 = __importDefault(require("./auth/routes/authRoutes"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const logProducerRoutes_1 = __importDefault(require("./api/routes/logProducerRoutes"));
const logSearchRoutes_1 = __importDefault(require("./api/routes/logSearchRoutes"));
const index_1 = require("./utils/index");
const logConsumer_1 = require("./consumer/logConsumer");
exports.isKafkaConnected = false;
let logInterval = null;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
exports.io = io;
const PORT = 7777;
const setKafkaConnected = (status) => {
    process.env.KAFKA_CONNECTED = status.toString();
};
// ADD THIS EXPORT FOR OTHER FILES
const getKafkaStatus = () => {
    return process.env.KAFKA_CONNECTED === "true";
};
exports.getKafkaStatus = getKafkaStatus;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use("/auth", authRoutes_1.default);
app.use("/logs", logSearchRoutes_1.default);
app.use("/logs", logProducerRoutes_1.default);
//Socket.io connection handling
io.on("connection", (socket) => {
    console.log("📌 Client connected:", socket.id);
    socket.on("disxonnect", () => {
        console.log("📌 Client disconnected:", socket.id);
    });
});
const gracefulShutdown = async () => {
    console.log("🔄 Initiating graceful shutdown...");
    try {
        await (0, index_1.closeProducer)();
        console.log("✅ Kafka producer closed");
    }
    catch (error) {
        console.error("❌ Error during shutdown");
    }
    io.close(() => {
        console.log("✅ Socket.io server closed");
    });
    process.exit(0);
};
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
const start = async () => {
    try {
        console.log("🚀 starting log worker..");
        await (0, index_1.initKafkaProducer)();
        setKafkaConnected(true);
        console.log("✅ Kafka connection established");
        //delete logs index because it has unmutable mapping so for caution purpose
        //await deleteLogsIndexOnce();
        //creates new logs index for storing document
        await (0, index_1.createLogsIndex)();
        await (0, logConsumer_1.initLogsConsumer)();
        server.listen(PORT, () => {
            console.log(`🌐 Unified server running on http://localhost:${PORT}`);
            console.log("🔗 Auth routes: /auth/*");
            console.log("📊 Log routes: /logs/*");
            console.log("📡 Socket.IO ready");
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        setKafkaConnected(true);
        // Start server anyway for health checks
        server.listen(PORT, () => {
            console.log(`⚠️ Service running on http://localhost:${PORT} (Kafka unavailable)`);
        });
    }
};
start();
