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
export declare const parsedCombinedLog: (line: string) => Promise<null | undefined>;
//# sourceMappingURL=logParser.d.ts.map