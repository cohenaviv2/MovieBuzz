import initServer from "./server";
import { handleSocket } from "./socketHandler";

initServer().then(([app, httpServer, io]) => {
  const PORT = process.env.SERVER_PORT;
  httpServer.listen(PORT, () =>
    console.log(`\n-> Connected to MongoDB\n-> Server is running on port ${PORT}\n-> Swagger: http://localhost:${PORT}/api-docs\n\nMovies:
    http://localhost:${PORT}/movies/search
    http://localhost:${PORT}/movies/popular
    http://localhost:${PORT}/movies/now-playing
    http://localhost:${PORT}/movies/upcoming
    http://localhost:${PORT}/movies/by-id/787699
    http://localhost:${PORT}/movies/by-genre/:genreId
    \nTv:
    http://localhost:${PORT}/tv/search
    http://localhost:${PORT}/tv/popular
    http://localhost:${PORT}/tv/top-rated
    http://localhost:${PORT}/tv/on-the-air
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
    http://localhost:${PORT}/posts/recent
    http://localhost:${PORT}/posts/top-rated
    http://localhost:${PORT}/posts/most-commented`)
  );
  handleSocket(io);
});
