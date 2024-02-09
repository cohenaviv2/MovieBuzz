import jwt from "jsonwebtoken";
import { UserControllerClass } from "./controllers/UserController";
import MessageController from "./controllers/MessageController";

export function handleSocket(io) {
    // Middleware for socket authentication
    io.use(authenticateSocket);

    io.on('connection', handleConnection);

    function authenticateSocket(socket, next) {
        console.log("Socket Connection!", socket.id);
        console.log("Checking auth", socket.id);
        const authToken = socket.handshake.query.authToken;

        const { isAuthenticated, userId } = authenticateUser(authToken);

        if (isAuthenticated) {
            console.log("Auth!");
            socket.userId = userId;
            return next();
        }
        console.log("Not Auth!");

        return next(new Error("Authentication failed."));
    }

    async function handleConnection(socket) {
        const { userId } = socket;
        console.log('User connected', userId);

        // Wait for a short period to allow potential removal to complete
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = await UserControllerClass.updateSocketId(userId, socket.id);
        io.emit('userConnected', { user: { _id: user._id, socketId: socket.id, fullName: user.fullName } });

        socket.on('send_private_message', handlePrivateMessage);

        socket.on('disconnect', handleDisconnect);

        async function handlePrivateMessage({ sender, receiver, text }) {
            try {
                const { isAuthenticated } = authenticateUser(socket.handshake.query.authToken);
                if (!isAuthenticated) {
                    throw new Error("User not authenticated");
                }

                const message = await MessageController.savePrivateMessage({ sender, receiver: receiver._id, text });
                if (message) {
                    io.to(receiver.socketId).emit('private_message_received', { message });
                }
            } catch (error) {
                console.error('Error handling private message:', error.message);
            }
        }

        async function handleDisconnect() {
            try {
                const { isAuthenticated } = authenticateUser(socket.handshake.query.authToken);
                if (!isAuthenticated) {
                    throw new Error("User not authenticated");
                }

                console.log('User disconnected');
                const disconnectedUserId = await UserControllerClass.removeSocketId(socket.id);
                console.log(disconnectedUserId);
                io.emit('userDisconnected', { disconnectedUserId });
            } catch (error) {
                console.error('Error handling disconnect:', error.message);
            }
        }
    }

    function authenticateUser(token) {
        console.log("Token:", token)
        if (!token) {
            console.log("ERROR! NO TOKEN");
            return { isAuthenticated: false, userId: null }
        }
        var isValidToken = false;
        var userId = null;
        const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
        jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
            if (err) {
                console.log("ERROR! TOKEN");
            }
            else {
                console.log("VALID! TOKEN");
                isValidToken = true;
                userId = user._id;
            }
        });
        return { isAuthenticated: isValidToken, userId: userId }
    }
}
