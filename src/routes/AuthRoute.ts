import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "../common/passport-config";
import AuthController from "../controllers/AuthController";

const router = express.Router();

// Set up Google session middleware
router.use(session({ secret: process.env.GOOGLE_CLIENT_SECRET, resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.post("/register", AuthController.register);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user to the site
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request. One or more required fields are missing or invalid.
 *       406:
 *         description: The email already exist
 */
router.post("/login", AuthController.login);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user to the site
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: The user logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               accessToken: "your_access_token"
 *               refreshToken: "your_refresh_token"
 *       400:
 *         description: Bad request. One or more required fields are missing or invalid.
 *       401:
 *         description: Authentication failed. Email or password is incorrect.
 */

router.get("/logout", AuthController.logout);
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Auth]
 *     description: Logout a user by providing the refresh token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout completed successfully
 *       401:
 *         description: Unauthorized. The provided refresh token is not valid or authorization failed.
 */

router.get("/refresh", AuthController.refreshToken);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: get a new access token using the refresh token
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The acess & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => res.send(req.user));


export default router;
