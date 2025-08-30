import type { Request, Response } from "express";
import { prisma } from "../../database/src";
import { signJwt, verifyJwt } from "../utils/jwt.js";

export const googleCallbackHandler = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (!user) return res.status(401).json({ message: "Auth failed" });

    const token = signJwt({
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
  } catch (err) {
    console.error("googleCallbackhandler:", err);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    // Use your verifyJwt utility instead of jwt.verify directly
    const payload = verifyJwt(token) as any;
    const userId = payload.sub;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
