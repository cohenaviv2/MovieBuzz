import express from "express";
import session from "express-session";
import "dotenv/config";
import passport from "../auth/passport-config";
import AuthController from "../controllers/AuthController";

const router = express.Router();

// Set up Google session middleware
router.use(session({ secret: process.env.GOOGLE_CLIENT_SECRET, resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/refreshToken", AuthController.refreshToken);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => res.redirect("/tv/popular"));

export default router;
