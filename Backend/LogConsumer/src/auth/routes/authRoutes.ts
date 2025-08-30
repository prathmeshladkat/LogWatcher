import { Router } from "express";
import passport from "../config/passport.js";
import {
  googleCallbackHandler,
  currentUser,
  logout,
} from "../controllers/authController.js";

const router: Router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

//callback (google -> your backend)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  googleCallbackHandler
);

router.get("/me", currentUser);
router.post("/logout", logout);

export default router;
