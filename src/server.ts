import express, { Express } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import movieRouter from "./routes/MovieRoutes";
import tvShowsRouter from "./routes/TvShowRoutes";
import commentRoutes from "./routes/CommentRoutes";
import postRoutes from "./routes/PostRoutes";
import userRoutes from "./routes/UserRoutes";

const initServer = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DATABASE_URL;
    mongoose.connect(url).then(() => {
      const app = express();
      app.use(express.json());
      app.use("/comments", commentRoutes);
      app.use("/posts", postRoutes);
      app.use("/users", userRoutes);
      app.use("/movies", movieRouter);
      app.use("/tv", tvShowsRouter);
      resolve(app)
    });
  });
  return promise;
};

export default initServer;
