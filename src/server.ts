import express, { Express } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./auth/passport-config"
import movieRouter from "./routes/MovieRoutes";
import tvShowsRouter from "./routes/TvShowRoutes";
import commentRoutes from "./routes/CommentRoutes";
import postRoutes from "./routes/PostRoutes";
import userRoutes from "./routes/UserRoutes";

const initServer = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("\nConnected to MongoDB"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DATABASE_URL;
    mongoose.connect(url).then(() => {
      const app = express();
      app.use(express.json());
      // Set up session middleware
      app.use(
        session({
          secret: "your-secret-key",
          resave: false,
          saveUninitialized: true,
        })
      );
      // Initialize Passport and restore authentication state if available
      app.use(passport.initialize());
      app.use(passport.session());

      // Route to initiate Google authentication
      app.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

      // Callback route after Google has authenticated the user
      app.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
        res.redirect("/"); // Redirect to the home page or your desired destination
      });
      app.use("/comments", commentRoutes);
      app.use("/posts", postRoutes);
      app.use("/users", userRoutes);
      app.use("/movies", movieRouter);
      app.use("/tv", tvShowsRouter);
      resolve(app);
    });
  });
  return promise;
};

export default initServer;
