/*dashboard -> search -> log modal*/
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Globe,
  Clock,
  User,
  Server,
  Code,
  FileText,
} from "lucide-react";

// Use the same types from your search page
export type LogLevel = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface LogSource {
  ip: string;
  access_time: string;
  method: string;
  endpoint: string;
  protocol: string;
  status: number;
  bytes: number;
  referrer: string;
  user_agent: string;
  log_time: string;
  log_level: LogLevel;
  service: string;
  message: string;
  request_id: string;
}

export interface LogEntry {
  id: string;
  source: LogSource;
  score: number | null;
}

interface LogDetailModalProps {
  log: LogEntry;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogDetailModal({
  log,
  isOpen,
  onClose,
}: LogDetailModalProps) {
  const getLevelBadgeVariant = (level: LogLevel) => {
    switch (level) {
      case "ERROR":
      case "CRITICAL":
        return "destructive";
      case "WARNING":
        return "secondary";
      case "INFO":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: number) => {
    if (status >= 500) return "destructive";
    if (status >= 400) return "secondary";
    if (status >= 300) return "outline";
    if (status >= 200) return "default";
    return "outline";
  };

  const getMethodBadgeVariant = (method: string) => {
    switch (method) {
      case "GET":
        return "default";
      case "POST":
        return "secondary";
      case "PUT":
        return "outline";
      case "DELETE":
        return "destructive";
      case "PATCH":
        return "secondary";
      default:
        return "outline";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    /*toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });*/
  };

  const downloadLog = () => {
    const dataStr = JSON.stringify(log, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `log-${log.id}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    /*toast({
      title: "Log downloaded",
      description: "Log has been downloaded successfully.",
    });*/
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Log Details
            <Badge variant={getLevelBadgeVariant(log.source.log_level)}>
              {log.source.log_level}
            </Badge>
            <Badge variant={getStatusBadgeVariant(log.source.status)}>
              {log.source.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Request Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Method
                </label>
                <div className="mt-1">
                  <Badge variant={getMethodBadgeVariant(log.source.method)}>
                    {log.source.method}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Endpoint
                </label>
                <div className="font-mono text-sm mt-1 break-all">
                  {log.source.endpoint}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Protocol
                </label>
                <div className="font-mono text-sm mt-1">
                  {log.source.protocol}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status Code
                </label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(log.source.status)}>
                    {log.source.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Response Size
                </label>
                <div className="text-sm mt-1">
                  {formatBytes(log.source.bytes)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Request ID
                </label>
                <div className="font-mono text-sm mt-1 break-all">
                  {log.source.request_id}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(log.source.request_id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Time & Service Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time & Service
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Log Time
                </label>
                <div className="font-mono text-sm mt-1">
                  {new Date(log.source.log_time).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Access Time
                </label>
                <div className="font-mono text-sm mt-1">
                  {new Date(log.source.access_time).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Service
                </label>
                <div className="font-medium mt-1">
                  <Badge variant="outline">{log.source.service}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Client Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  IP Address
                </label>
                <div className="font-mono text-sm mt-1 flex items-center gap-2">
                  {log.source.ip}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(log.source.ip)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  User Agent
                </label>
                <div className="text-sm mt-1 p-2 bg-background rounded border break-all">
                  {log.source.user_agent}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(log.source.user_agent)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Referrer
                </label>
                <div className="text-sm mt-1 p-2 bg-background rounded border break-all">
                  {log.source.referrer}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(log.source.referrer)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Log Message */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Log Message
            </h3>
            <div className="p-3 bg-background rounded border">
              <div className="text-sm">{log.source.message}</div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-8"
                onClick={() => copyToClipboard(log.source.message)}
              >
                <Copy className="h-3 w-3 mr-2" />
                Copy Message
              </Button>
            </div>
          </div>

          {/* Raw JSON Data */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code className="h-4 w-4" />
                Raw JSON Data
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </Button>
                <Button variant="outline" size="sm" onClick={downloadLog}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-lg overflow-x-auto max-h-96">
              <pre>{JSON.stringify(log, null, 2)}</pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
