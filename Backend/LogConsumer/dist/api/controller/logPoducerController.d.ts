import type { Request, Response } from "express";
export declare const startSendingLogs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const stopSendingLogs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const clearLogInterval: () => void;
export declare const getStreamingStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=logPoducerController.d.ts.map