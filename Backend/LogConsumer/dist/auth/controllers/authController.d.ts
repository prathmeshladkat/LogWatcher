import type { Request, Response } from "express";
export declare const googleCallbackHandler: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const currentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (req: Request, res: Response) => void;
//# sourceMappingURL=authController.d.ts.map