import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const JWT_EXPIRES_IN = 3600;

export function signJwt(payload: object, options?: SignOptions): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  };

  // Explicit type assertion to avoid TypeScript confusion
  return jwt.sign(payload, secret as string, signOptions);
}

export function verifyJwt(token: string): JwtPayload | string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  try {
    return jwt.verify(token, secret as string);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function isTokenValid(token: string): boolean {
  try {
    verifyJwt(token);
    return true;
  } catch {
    return false;
  }
}
