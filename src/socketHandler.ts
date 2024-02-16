import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { UserControllerClass } from "./controllers/UserController";
import MessageController from "./controllers/MessageController";
import { NextFunction } from "express";

interface IOSocket extends Socket {
  userId: string;
}

interface IOClient {
  _id: string;
  socketId: string;
  fullName: string;
}

export function handleSocket(io: SocketIOServer) {
  
  function authenticateSocket(socket: IOSocket, next: NextFunction) {
    console.log("Socket Connection: " + socket.id);
    const authToken = socket.handshake.query.authToken as string;

    const { isAuthenticated, userId } = authenticateUser(authToken);

    if (!isAuthenticated) {
      return next(new Error("Authentication failed."));
    }
    socket.userId = userId;
    return next();
  }

  // Middleware for socket authentication
  io.use(authenticateSocket);

  io.on("connection", handleConnection);

  async function handleConnection(socket: IOSocket) {
    const userId = socket.userId;
    console.log("User connected", userId);

    // Wait for a short period to allow potential removal to complete
    await new Promise((r) => setTimeout(r, 300));

    const user = await UserControllerClass.updateSocketId(userId, socket.id);
    // io.emit("userConnected", { user: { _id: user._id, socketId: socket.id, fullName: user.fullName } });

    socket.on("send_private_message", handlePrivateMessage);

    socket.on("disconnect", handleDisconnect);

    async function handlePrivateMessage(sender: IOClient, receiver: IOClient, text: string) {
      try {
        // const { isAuthenticated } = authenticateUser(socket.handshake.query.authToken);
        // if (!isAuthenticated) {
        //   throw new Error("User not authenticated");
        // }

        const message = await MessageController.savePrivateMessage(sender._id, receiver._id, text);
        if (message) {
          io.to(receiver.socketId).emit("private_message_received", { message });
        }
      } catch (error) {
        console.error("Error handling private message:", error.message);
      }
    }

    async function handleDisconnect() {
      try {
        const authToken = socket.handshake.query.authToken as string;
        const { isAuthenticated } = authenticateUser(authToken);
        if (!isAuthenticated) {
          throw new Error("User not authenticated");
        }

        console.log("User disconnected");
        const disconnectedUserId = await UserControllerClass.removeSocketId(socket.id);
        console.log(disconnectedUserId);
        io.emit("userDisconnected", { disconnectedUserId });
      } catch (error) {
        console.error("Error handling disconnect:", error.message);
      }
    }
  }

  function authenticateUser(token: string) {
    console.log("Token:", token);
    if (!token) {
      console.log("ERROR! NO TOKEN");
      return { isAuthenticated: false, userId: null };
    }
    var isValidToken = false;
    var userId = null;
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        console.log("ERROR! TOKEN");
      } else {
        console.log("VALID! TOKEN");
        isValidToken = true;
        userId = user as { _id: string };
      }
    });
    return { isAuthenticated: isValidToken, userId: userId };
  }
}
