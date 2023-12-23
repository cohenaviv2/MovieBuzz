import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel, { IUser } from "../models/UserModel";
import "dotenv/config";
import { signToken } from "./AuthController";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback", // Adjust the URL based on your deployment
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in your database
        let user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          // User already exists, generate an access token
          const token = signToken(user._id);
          return done(null, { user, accessToken: token });
        } else {
          console.log("** NEW USER **");
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
        };

        user = await UserModel.create(userData);

        // Generate an access token for the new user
        const token = signToken(user._id);
        

        done(null, { user, accessToken: token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((params: { user: IUser; accessToken: string }, done) => {
  done(null, params.user);
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
