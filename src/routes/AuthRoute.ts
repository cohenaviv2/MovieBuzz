import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "../auth/passport-config";
import AuthController from "../controllers/AuthController";
import authMiddleware from "../auth/authMiddleware";

const router = express.Router();

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Set up Google session middleware
router.use(session({ secret: process.env.GOOGLE_CLIENT_SECRET, resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/logout", AuthController.logout);
router.get("/refresh", AuthController.refreshToken);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  const { accessToken, refreshToken } = req.user as Tokens;
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

export default router;
