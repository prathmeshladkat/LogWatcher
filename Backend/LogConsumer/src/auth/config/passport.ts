import passport from "passport";
import { Strategy as GoogleStartergy } from "passport-google-oauth20";
import { prisma } from "../../database/src";

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

passport.use(
  new GoogleStartergy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value ?? "";
        const name = profile.displayName ?? null;

        let user = await prisma.user.findUnique({ where: { googleId } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId,
              email,
              name,
              lastLogin: new Date(),
            },
          });
        } else {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date(), email, name },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;
