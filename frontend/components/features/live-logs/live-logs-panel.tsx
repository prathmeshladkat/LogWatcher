"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Pause, Play, Trash2 } from "lucide-react";
import { useLogs } from "@/context/LogsContext"; // You'll need to create this path

export default function LiveLogsPanel() {
  const {
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
  } = useLogs();

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new logs arrive (only when streaming)
  useEffect(() => {
    if (logsEndRef.current && isStreaming && logs.length > 0) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isStreaming]);

  // Handle Start/Pause button click
  const handleStreamingToggle = async () => {
    if (isStreaming) {
      await stopStreaming();
    } else {
      await startStreaming();
    }
  };

  // Get badge variant based on log level
  const getLevelBadgeVariant = (level: string) => {
    switch (level?.toUpperCase()) {
      case "ERROR":
        return "destructive";
      case "WARN":
        return "secondary";
      case "INFO":
        return "default";
      case "DEBUG":
        return "outline";
      default:
        return "default";
    }
  };

  // Get text color based on log level
  const getLevelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "ERROR":
        return "text-red-400";
      case "WARN":
        return "text-yellow-400";
      case "INFO":
        return "text-green-400";
      case "DEBUG":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Live Logs
              <Badge variant={isStreaming ? "default" : "secondary"}>
                {isStreaming ? "Streaming" : "Paused"}
              </Badge>
              {/* Connection Status */}
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="ml-2"
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStreamingToggle}
                disabled={!isConnected || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    {isStreaming ? "Stopping..." : "Starting..."}
                  </>
                ) : isStreaming ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          {/* Stats */}
          <div className="text-sm text-gray-600 mt-2">
            Total Logs: <span className="font-medium">{logs.length}</span>
            {isConnected && (
              <span className="ml-4">
                Status:{" "}
                <span className="font-mono text-xs">
                  {isStreaming ? "🟢 Active" : "🔴 Inactive"}
                </span>
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="mb-1 hover:bg-gray-800 p-1 rounded cursor-pointer text-center py-8">
                {!isConnected
                  ? "Connecting to server..."
                  : isStreaming
                  ? "Waiting for logs..."
                  : 'No logs yet. Click "Start" to begin streaming.'}
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="mb-1 hover:bg-gray-800 p-1 rounded cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <span className="text-gray-400">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>{" "}
                  <Badge
                    variant={getLevelBadgeVariant(log.level)}
                    className="mr-2 text-xs"
                  >
                    {log.level}
                  </Badge>
                  <span className="text-blue-400">[{log.service}]</span>{" "}
                  <span className={getLevelColor(log.level)}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Selected Log Details Modal */}
      {selectedLog && (
        <Card className="mt-4 border-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Log Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <strong>Timestamp:</strong>
                <span className="ml-2 font-mono">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </span>
              </div>
              <div>
                <strong>Level:</strong>
                <Badge
                  variant={getLevelBadgeVariant(selectedLog.level)}
                  className="ml-2"
                >
                  {selectedLog.level}
                </Badge>
              </div>
              <div>
                <strong>Service:</strong>
                <span className="ml-2 font-mono text-blue-600">
                  {selectedLog.service}
                </span>
              </div>
              <div>
                <strong>Message:</strong>
                <div className="mt-1 p-2 bg-white border rounded font-mono text-sm">
                  {selectedLog.message}
                </div>
              </div>
              <div>
                <strong>Log ID:</strong>
                <span className="ml-2 font-mono text-xs text-gray-500">
                  {selectedLog.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
