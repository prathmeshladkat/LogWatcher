"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const src_1 = require("../../database/src");
// DEBUG: Check if environment variables are loaded
{
    /*console.log("🔍 DEBUG - Environment variables:");
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log(
    "GOOGLE_CLIENT_SECRET:",
    process.env.GOOGLE_CLIENT_SECRET ? "***HIDDEN***" : "MISSING"
  );
  console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);*/
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value ?? "";
        const name = profile.displayName ?? null;
        let user = await src_1.prisma.user.findUnique({ where: { googleId } });
        if (!user) {
            user = await src_1.prisma.user.create({
                data: {
                    googleId,
                    email,
                    name,
                    lastLogin: new Date(),
                },
            });
        }
        else {
            user = await src_1.prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date(), email, name },
            });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
exports.default = passport_1.default;
