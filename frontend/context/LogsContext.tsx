"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface LogEntry {
  id: string | number;
  timestamp: string;
  level: string;
  service: string;
  message: string;
}

interface LogContextType {
  logs: LogEntry[];
  isStreaming: boolean;
  isConnected: boolean;
  isLoading: boolean;
  startStreaming: () => Promise<void>;
  stopStreaming: () => Promise<void>;
  clearLogs: () => void;
  exportLogs: () => void;
  selectedLog: LogEntry | null;
  setSelectedLog: (log: LogEntry | null) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (socketRef.current) return;

    console.log("🔌 Initializing socket connection...");

    socketRef.current = io("http://localhost:7777", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    //connection event handler
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsConnected(true);
      checkBackendStreamingStatus();
    });

    socket.on("disconnect", () => {
      console.log("Disconnect from server");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    //Lisen o incoming logs
    socket.on("log", (logData) => {
      console.log("📨 Received log:", logData);
      setLogs((prevLogs) => [
        ...prevLogs,
        {
          id: logData.id || Date.now() + Math.random(),
          timestamp: logData.datetime,
          level: logData.log_level,
          service: logData.service,
          message: logData.message,
        },
      ]);
    });

    socket.connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  //check if backend is streaming
  const checkBackendStreamingStatus = async () => {
    try {
      const response = await fetch("http://localhost:7777/logs/status");
      if (response.ok) {
        const result = await response.json();
        setIsStreaming(result.isStreaming || false);
      }
    } catch (error) {
      console.error("Error checking backend status:", error);
    }
  };

  const startStreaming = async () => {
    if (isLoading || isStreaming) return;

    setIsLoading(true);

    try {
      // Clear existing logs when starting fresh
      setLogs([]);

      const response = await fetch("http://localhost:7777/logs/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: Date.now(),
          action: "start_streaming",
          logLevel: "all",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Logs started:", result);
        setIsStreaming(true);
      } else {
        console.error("❌ Failed to start logs:", response.statusText);
        throw new Error("Failed to start logs");
      }
    } catch (error) {
      console.error("❌ Error starting streaming:", error);
      alert("Error starting streaming");
    } finally {
      setIsLoading(false);
    }
  };

  // Stop streaming function
  const stopStreaming = async () => {
    if (isLoading || !isStreaming) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:7777/logs/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: Date.now(),
          action: "stop_streaming",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Logs stopped:", result);
        setIsStreaming(false);
      } else {
        console.error("❌ Failed to stop logs:", response.statusText);
        throw new Error("Failed to stop logs");
      }
    } catch (error) {
      console.error("❌ Error stopping streaming:", error);
      alert("Error stopping streaming");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    setSelectedLog(null);
  };

  // Export logs to JSON
  const exportLogs = () => {
    if (logs.length === 0) return;

    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `logs_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const value: LogContextType = {
    logs,
    isStreaming,
    isConnected,
    isLoading,
    startStreaming,
    stopStreaming,
    clearLogs,
    exportLogs,
    selectedLog,
    setSelectedLog,
  };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLogs must be used within a LogsProvider");
  }
  return context;
}
