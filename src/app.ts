import initServer from "./server";

initServer().then(([app, httpServer, io])=> {
    const PORT = process.env.SERVER_PORT || 5000;
    httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}\n\nMovies:
    http://localhost:${PORT}/movies/search
    http://localhost:${PORT}/movies/popular
    http://localhost:${PORT}/movies/now_playing
    http://localhost:${PORT}/movies/upcoming
    http://localhost:${PORT}/movies/by-id/787699
    http://localhost:${PORT}/movies/by-genre/:genreId
    \nTv:
    http://localhost:${PORT}/tv/search
    http://localhost:${PORT}/tv/popular
    http://localhost:${PORT}/tv/top_rated
    http://localhost:${PORT}/tv/on_the_air
    http://localhost:${PORT}/tv/by-id/63770
    http://localhost:${PORT}/tv/by-genre/:genreId
    \nAuth:
    http://localhost:${PORT}/auth/login
    http://localhost:${PORT}/auth/register
    http://localhost:${PORT}/auth/logout
    http://localhost:${PORT}/auth/google
    \nUser:
    http://localhost:${PORT}/user/:id
    \nPosts:
    http://localhost:${PORT}/posts/recent`
    ));

    io.on('connection', (socket) => {
        console.log(`User ${socket.id} connected`);

        socket.on('chat message', (message) => {
            console.log(`${socket.id}:`, message);

            io.emit('chat message', `${socket.id}: ` + message);
        });
        
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
});
