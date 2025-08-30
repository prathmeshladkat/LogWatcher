"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
exports.isTokenValid = isTokenValid;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_EXPIRES_IN = 3600;
function signJwt(payload, options) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is required");
    }
    const signOptions = {
        expiresIn: JWT_EXPIRES_IN,
        ...options,
    };
    // Explicit type assertion to avoid TypeScript confusion
    return jsonwebtoken_1.default.sign(payload, secret, signOptions);
}
function verifyJwt(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is required");
    }
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
}
function isTokenValid(token) {
    try {
        verifyJwt(token);
        return true;
    }
    catch {
        return false;
    }
}
