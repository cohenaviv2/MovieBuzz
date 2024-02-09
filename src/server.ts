import express from "express";
import mongoose from "mongoose";
import { createServer } from 'http';
import movieRouter from "./routes/MovieRoute";
import tvShowsRouter from "./routes/TvShowRoute";
import commentRoutes from "./routes/CommentRoute";
import postRoutes from "./routes/PostRoute";
import authRoutes from "./routes/AuthRoute";
import userRoute from "./routes/UserRoute"
import messageRoute from "./routes/MessageRoute"
import "dotenv/config";

const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const { Server } = require('socket.io');

const initServer = async (): Promise<[typeof app, typeof httpServer, typeof io]> => {
  app.use(
    cors({
      origin: 'http://localhost:3000', // Change this to the actual origin of your client app
      credentials: true, // Allow credentials (cookies) to be sent with the request
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/user", userRoute);
  app.use("/comments", commentRoutes);
  app.use("/posts", postRoutes);
  app.use("/message", messageRoute);
  app.use("/movies", movieRouter);
  app.use("/tv", tvShowsRouter);

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  const url = process.env.DATABASE_URL;
  await mongoose.connect(url);
  console.log("Connected to MongoDB")

  return [app, httpServer, io]
};

export default initServer;
