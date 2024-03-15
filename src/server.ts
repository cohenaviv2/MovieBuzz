import "dotenv/config";
import express, { Express } from "express";
import mongoose from "mongoose";
import http, { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./common/swagger-config";
import cookieParser from "cookie-parser";
import cors from "cors";
import movieRouter from "./routes/MovieRoute";
import tvShowsRouter from "./routes/TvShowRoute";
import commentRoutes from "./routes/CommentRoute";
import postRoutes from "./routes/PostRoute";
import authRoutes from "./routes/AuthRoute";
import userRoute from "./routes/UserRoute";
import uploadRoute from "./routes/UploadRoute";
import messageRoute from "./routes/MessageRoute";

function initServer() {
  const promise = new Promise<[Express, HttpServer, SocketIOServer]>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    const url = process.env.DATABASE_URL;
    mongoose.connect(url).then(() => {
      const app = express();
      const specs = swaggerJsDoc(options);
      // app.use(
      //   cors({
      //     origin: "http://localhost:3000",
      //     credentials: true, // Allow credentials (cookies) to be sent with the request
      //   })
      // );
      app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
      app.use(cookieParser());
      app.use(express.json());
      app.use(cors());
      app.use("/uploads", express.static(path.join(__dirname, "uploads")));
      app.use("/image", uploadRoute);
      app.use("/auth", authRoutes);
      app.use("/users", userRoute);
      app.use("/comments", commentRoutes);
      app.use("/posts", postRoutes);
      app.use("/message", messageRoute);
      app.use("/movies", movieRouter);
      app.use("/tv", tvShowsRouter);

      const httpServer = http.createServer(app);
      const io = new SocketIOServer(httpServer, {
        cors: {
          origin: "https://localhost:5173", // Allow requests from the root domain
          methods: ["GET", "POST"],
          credentials: true,
        },
      });

      resolve([app, httpServer, io]);
    });
  });

  return promise;
}

export default initServer;
