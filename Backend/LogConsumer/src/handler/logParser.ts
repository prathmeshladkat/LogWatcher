import { saveLog } from "../consumer/saveLog";
import { io } from "../index";

export interface ParsedLog {
  ip: string | undefined;
  access_time: string | undefined;
  method: string | undefined;
  endpoint: string | undefined;
  protocol: string | undefined;
  status: number | undefined;
  bytes: number | undefined;
  referrer: string | undefined;
  user_agent: string | undefined;
  log_time: string | undefined;
  log_level: string | undefined;
  message: string | undefined;
  request_id: string | undefined;
}

export const parsedCombinedLog = async (line: string) => {
  const logRegex = new RegExp(
    String.raw`(?<ip>\d+\.\d+\.\d+\.\d+) - - \[(?<access_time>[^\]]+)\] ` +
      String.raw`"(?<method>[A-Z]+) (?<endpoint>/[^\s]+) (?<protocol>HTTP/[0-9.]+)" ` +
      String.raw`(?<status>\d{3}) (?<bytes>\d+) "(?<referrer>[^"]+)" "(?<user_agent>[^"]+)" \|\| ` +
      String.raw`(?<log_time>\S+) \[(?<log_level>[A-Z]+)\] (?<service>[A-Za-z-]+Service) (?<message>.+?) - requestId=(?<request_id>[a-f0-9-]+)`
  );
  /*const logRegex = new RegExp(
    String.raw`(?<ip>\d+\.\d+\.\d+\.\d+) - - \[(?<access_time>[^\]]+)\] ` +
      String.raw`"(?<method>[A-Z]+) (?<endpoint>/[^\s]+) (?<protocol>HTTP/[0-9.]+)" ` +
      String.raw`(?<status>\d{3}) (?<bytes>\d+) "(?<referrer>[^"]+)" "(?<user_agent>[^"]+)" \|\| ` +
      String.raw`(?<log_time>\S+) \[(?<log_level>[A-Z]+)\] (?<message>.+?) - requestId=(?<request_id>[a-f0-9-]+)`
  );*/

  const match = line.match(logRegex);
  if (!match || !match.groups) {
    return null;
  }

  const log = {
    ip: match.groups.ip ?? undefined,
    access_time: match.groups.access_time ?? undefined,
    method: match.groups.method ?? undefined,
    endpoint: match.groups.endpoint ?? undefined,
    protocol: match.groups.protocol ?? undefined,
    status: match.groups.status ? parseInt(match.groups.status, 10) : undefined,
    bytes: match.groups.bytes ? parseInt(match.groups.bytes, 10) : undefined,
    referrer: match.groups.referrer ?? undefined,
    user_agent: match.groups.user_agent ?? undefined,
    log_time: match.groups.log_time ?? undefined,
    log_level: match.groups.log_level ?? undefined,
    service: match.groups.service ?? undefined,
    message: match.groups.message?.trim() ?? undefined,
    request_id: match.groups.request_id ?? undefined,
  };
  console.log(log);

  try {
    //save parsed log into ES
    await saveLog(log);

    //  EMIT TO FRONTEND VIA SOCKET.IO
    io.emit("log", {
      datetime: log.log_time || new Date().toISOString(), // Use log_time or fallback
      log_level: log.log_level,
      message: log.message,
      service: log.service,
      id: Date.now() + Math.random(), // Unique ID for React keys
    });
    console.log("log emitted successfully");
  } catch (err) {
    console.error("save to database:", err);
  }
};

// Example usage
