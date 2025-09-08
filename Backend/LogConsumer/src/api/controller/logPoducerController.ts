import { produceLogs } from "../../utils/index";
import { faker } from "@faker-js/faker";
import type { Request, Response } from "express";

// Use environment variable instead of import
const isKafkaConnected = () => {
  return process.env.KAFKA_CONNECTED === "true";
};

// Move logInterval to module level for this controller
let logInterval: NodeJS.Timeout | null = null;

function generateLog() {
  const ip = faker.internet.ip();
  const timestamp = new Date().toISOString();
  const method = faker.helpers.arrayElement(["GET", "POST", "PUT", "DELETE"]);
  const url = faker.helpers.arrayElement([
    "/api/users",
    "/api/login",
    "/home",
    "/api/data",
  ]);
  const statusCode = faker.helpers.arrayElement([200, 201, 400, 404, 500]);
  const responseTime = faker.number.int({ min: 10, max: 500 }); // ms

  const nginxLog = `${ip} - - [${timestamp}] "${method} ${url} HTTP/1.1" ${statusCode} ${faker.number.int(
    { min: 100, max: 5000 }
  )} "${faker.internet.url()}" "${faker.internet.userAgent()}"`;

  // Simulate Node.js app log format
  const logLevel = faker.helpers.arrayElement([
    "INFO",
    "WARN",
    "ERROR",
    "DEBUG",
  ]);
  const message = faker.helpers.arrayElement([
    "User logged in",
    "Database connection established",
    "Invalid token provided",
    "File uploaded successfully",
    "Cache miss for key: session_123",
    "Failed to process batch job",
  ]);

  const services = faker.helpers.arrayElement([
    "Auth Service",
    "Notification-Service",
    "Payment-Service",
    "User-Service",
    "DataProcessor-Service",
  ]);

  const nodeLog = `${timestamp} [${logLevel}] ${services} ${message} - requestId=${faker.string.uuid()}`;

  // Combine into one raw log entry (separated by || for parsing later)
  return `${nginxLog} || ${nodeLog}`;
}

export const startSendingLogs = async (req: Request, res: Response) => {
  console.log("received request to start logs...");

  // Fixed: Call the function instead of accessing variable
  if (!isKafkaConnected()) {
    return res.status(503).json({
      message: "Kafka is not connected. cannot start producing logs",
    });
  }

  if (logInterval) {
    return res.status(400).json({ message: "Logs already being produced" });
  }

  try {
    console.log("⏰ setting up log production interval...");
    logInterval = setInterval(async () => {
      try {
        const logMessage = generateLog();
        console.log("📋 Generated log message:", logMessage);

        await produceLogs("logs", logMessage);
        console.log("✅ Log produced and sent to Kafka");
      } catch (error) {
        console.error("❌ Error in log production cycle:", error);
      }
    }, 20000); // Changed to 2 seconds to match your message

    res.json({ message: "Started producing logs every 2 seconds" });
    console.log("✅ Log production started successfully");
  } catch (error) {
    console.error("❌ Error starting log production:", error);
    res.status(500).json({ message: "Failed to start log production" });
  }
};

export const stopSendingLogs = async (req: Request, res: Response) => {
  console.log("🛑 Received request to stop logs...");

  if (logInterval) {
    clearInterval(logInterval);
    logInterval = null;
    console.log("✅ Log production stopped");
    return res.json({ message: "Stopped producing logs" });
  }

  res.status(400).json({ message: "No logs were being produced" });
};

// Export function to clear interval during shutdown (optional)
export const clearLogInterval = () => {
  if (logInterval) {
    clearInterval(logInterval);
    logInterval = null;
  }
};

export const getStreamingStatus = async (req: Request, res: Response) => {
  try {
    const isCurrentlyStreaming = logInterval !== null;

    res.json({
      isStreaming: isCurrentlyStreaming,
      message: isCurrentlyStreaming
        ? "Logs are being produced"
        : "Logs production is stopped",
    });
  } catch (error) {
    console.error("❌ Error getting streaming status:", error);
    res.status(500).json({ message: "Failed to get streaming status" });
  }
};
