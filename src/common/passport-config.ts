import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel, { IUser } from "../models/UserModel";
import "dotenv/config";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (googleAccessToken, googleRefreshToken, profile, done) => {
      try {
        // Check if the user already exists in the DB
        let user = await UserModel.findOne({ googleId: profile.id });
        if (user) {
          // If the user already exists, update tokens and return user
          const userInfo = { _id: user._id };
          const accessToken = jwt.sign(userInfo, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
          const refreshToken = jwt.sign(userInfo, JWT_REFRESH_SECRET);

          user.tokens = [refreshToken];
          await user.save();
          const userId = userInfo._id;

          return done(null, { userId, accessToken, refreshToken });
        }
        

        // If the user doesn't exist, create a new user
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";

        const newUser: IUser = {
          fullName: firstName + " " + lastName,
          email: profile.emails?.[0].value || "",
          imageUrl: profile.photos?.[0].value || "",
          role: "user", // Set a default role
          password: "googlegoogle",
          googleId: profile.id,
          tokens: [],
          socketId: "",
        };

        // Generate tokens for the new user
        user = await UserModel.create(newUser);
        const userInfo = { _id: user._id };
        const accessToken = jwt.sign(userInfo, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jwt.sign(userInfo, JWT_REFRESH_SECRET);

        user.tokens = [refreshToken];
        await user.save();

        const userId = userInfo._id;

        return done(null, { userId, accessToken, refreshToken });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
