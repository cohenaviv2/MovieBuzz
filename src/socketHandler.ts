import { Server as SocketIOServer, Socket } from "socket.io";
import { UserControllerClass } from "./controllers/UserController";
import MessageController from "./controllers/MessageController";

interface IOSocket extends Socket {
  userId: string;
}

interface IOClient {
  _id: string;
  socketId: string;
  fullName: string;
}

export function handleSocket(io: SocketIOServer) {
  io.on("connection", handleConnection);

  async function handleConnection(socket: IOSocket) {
    const userId = socket.handshake.query.userId as string;
    console.log("User connected: " + userId + "\n");

    // Wait for a short period to allow potential removal to complete
    await new Promise((r) => setTimeout(r, 300));

    const user = await UserControllerClass.updateSocketId(userId, socket.id);

    socket.on("send_private_message", handlePrivateMessage);

    socket.on("disconnect", handleDisconnect);

    async function handlePrivateMessage(sender: IOClient, receiver: IOClient, text: string) {
      console.log(sender);
      console.log(receiver);
      console.log(text);
      try {
        const message = await MessageController.savePrivateMessage(sender._id, receiver._id, text);
        if (message) {
          console.log("Sending message...\n");
          io.to(receiver.socketId).emit("private_message_received", { message,sender });
        }
      } catch (error) {
        console.error("Error handling private message:", error.message);
      }
    }

    async function handleDisconnect() {
      try {
        const disconnectedUserId = await UserControllerClass.removeSocketId(socket.handshake.query.userId as string);
        console.log("User disconnected: " + disconnectedUserId + "\n");
        io.emit("userDisconnected", { disconnectedUserId });
      } catch (error) {
        console.error("Error handling disconnect:", error.message);
      }
    }
  }
}
