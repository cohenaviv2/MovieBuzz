import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel, { IUser } from "../models/UserModel";
import "dotenv/config";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the DB
        let user = await UserModel.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // If the user doesn't exist, create a new user
        const userData: IUser = {
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          email: profile.emails?.[0].value || "",
          image: profile.photos?.[0].value || "",
          role: "user", // Set a default role
          password: "default",
          passwordConfirm: "default",
          googleId: profile.id,
          posts: [],
          tokens: [],
        };

        user = await UserModel.create(userData);

        done(null, user._id);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((id: string, done) => {
  done(null, id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
