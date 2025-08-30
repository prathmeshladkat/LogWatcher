"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_js_1 = __importDefault(require("../config/passport.js"));
const authController_js_1 = require("../controllers/authController.js");
const router = (0, express_1.Router)();
router.get("/google", passport_js_1.default.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
}));
//callback (google -> your backend)
router.get("/google/callback", passport_js_1.default.authenticate("google", { failureRedirect: "/", session: false }), authController_js_1.googleCallbackHandler);
router.get("/me", authController_js_1.currentUser);
router.post("/logout", authController_js_1.logout);
exports.default = router;
