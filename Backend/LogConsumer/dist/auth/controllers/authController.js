"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.currentUser = exports.googleCallbackHandler = void 0;
const src_1 = require("../../database/src");
const jwt_js_1 = require("../utils/jwt.js");
const googleCallbackHandler = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Auth failed" });
        const token = (0, jwt_js_1.signJwt)({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60, // 1 hour (match JWT_EXPIRES_IN)
        });
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
    catch (err) {
        console.error("googleCallbackhandler:", err);
        return res.status(500).json({ message: "Internal error" });
    }
};
exports.googleCallbackHandler = googleCallbackHandler;
const currentUser = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token)
            return res.status(401).json({ message: "Not Authenticated" });
        // Use your verifyJwt utility instead of jwt.verify directly
        const payload = (0, jwt_js_1.verifyJwt)(token);
        const userId = payload.sub;
        const user = await src_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.currentUser = currentUser;
const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};
exports.logout = logout;
