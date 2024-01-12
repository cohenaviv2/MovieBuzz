import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import movieRouter from "./routes/MovieRoute";
import tvShowsRouter from "./routes/TvShowRoute";
import commentRoutes from "./routes/CommentRoute";
import postRoutes from "./routes/PostRoute";
import authRoutes from "./routes/AuthRoute";
import userRoute from "./routes/UserRoute";
import uploadRoute from "./routes/UploadRoute";
import "dotenv/config";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./common/swagger-config";

const initServer = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    const url = process.env.DATABASE_URL;
    mongoose.connect(url).then(() => {
      const app = express();
      const specs = swaggerJsDoc(options);
      app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
      app.use(express.json());
      app.use(cors());
      app.use("/uploads", express.static(path.join(__dirname, "uploads")));
      app.use("/image", uploadRoute);
      app.use("/auth", authRoutes);
      app.use("/user", userRoute);
      app.use("/comments", commentRoutes);
      app.use("/posts", postRoutes);
      app.use("/movies", movieRouter);
      app.use("/tv", tvShowsRouter);
      resolve(app);
    });
  });
  return promise;
};

export default initServer;
