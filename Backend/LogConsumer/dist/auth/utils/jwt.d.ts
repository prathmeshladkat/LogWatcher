import { type JwtPayload, type SignOptions } from "jsonwebtoken";
export declare function signJwt(payload: object, options?: SignOptions): string;
export declare function verifyJwt(token: string): JwtPayload | string;
export declare function isTokenValid(token: string): boolean;
//# sourceMappingURL=jwt.d.ts.map