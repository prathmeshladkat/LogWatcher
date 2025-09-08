import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./auth/config/passport";
import authRoutes from "./auth/routes/authRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import logsRoutes from "./api/routes/logProducerRoutes";
import searchRoutes from "./api/routes/logSearchRoutes";

import {
  closeProducer,
  createLogsIndex,
  deleteLogsIndexOnce,
  esClient,
  initKafkaProducer,
} from "./utils/index";
import { initLogsConsumer } from "./consumer/logConsumer";

export let isKafkaConnected = false;
let logInterval: NodeJS.Timeout | null = null;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 7777;

const setKafkaConnected = (status: boolean) => {
  process.env.KAFKA_CONNECTED = status.toString();
};

// ADD THIS EXPORT FOR OTHER FILES
export const getKafkaStatus = () => {
  return process.env.KAFKA_CONNECTED === "true";
};

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/logs", searchRoutes);
app.use("/logs", logsRoutes);

//Socket.io connection handling
io.on("connection", (socket) => {
  console.log("📌 Client connected:", socket.id);
  socket.on("disxonnect", () => {
    console.log("📌 Client disconnected:", socket.id);
  });
});

export { io };

const gracefulShutdown = async () => {
  console.log("🔄 Initiating graceful shutdown...");
  try {
    await closeProducer();
    console.log("✅ Kafka producer closed");
  } catch (error) {
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

    await initKafkaProducer();
    setKafkaConnected(true);
    console.log("✅ Kafka connection established");

    //delete logs index because it has unmutable mapping so for caution purpose
    //await deleteLogsIndexOnce();

    //creates new logs index for storing document
    await createLogsIndex();

    await initLogsConsumer();

    server.listen(PORT, () => {
      console.log(`🌐 Unified server running on http://localhost:${PORT}`);
      console.log("🔗 Auth routes: /auth/*");
      console.log("📊 Log routes: /logs/*");
      console.log("📡 Socket.IO ready");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    setKafkaConnected(true);
    // Start server anyway for health checks
    server.listen(PORT, () => {
      console.log(
        `⚠️ Service running on http://localhost:${PORT} (Kafka unavailable)`
      );
    });
  }
};

start();
