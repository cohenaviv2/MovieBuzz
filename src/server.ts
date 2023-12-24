import express, { Express } from "express";
import mongoose from "mongoose";
import movieRouter from "./routes/MovieRoute";
import tvShowsRouter from "./routes/TvShowRoute";
import commentRoutes from "./routes/CommentRoute";
import postRoutes from "./routes/PostRoute";
import authRoutes from "./routes/AuthRoute";
import authMiddleware from "./auth/authMiddleware";
import "dotenv/config";

const initServer = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    const url = process.env.DATABASE_URL;
    mongoose.connect(url).then(() => {
      const app = express();
      app.use(express.json());
      app.use("/auth", authRoutes);
      app.use("/comments",authMiddleware, commentRoutes); // Only signed user can see commnets
      app.use("/posts", postRoutes);
      app.use("/movies", movieRouter);
      app.use("/tv", tvShowsRouter);
      resolve(app);
    });
  });
  return promise;
};

export default initServer;
