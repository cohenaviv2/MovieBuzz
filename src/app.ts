import express from "express";
import movieRouter from "./routes/movieRouter";
import tvShowsRouter from "./routes/tvShowsRouter"
import "dotenv/config";

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use("/movies", movieRouter);
app.use("/tv",tvShowsRouter);

app.listen(port, () => {
  console.log(`\n\nServer is running on http://localhost:${port}\n\nMovies:\n
http://localhost:5000/movies/search\n
http://localhost:5000/movies/popular\n
http://localhost:5000/movies/now_playing\n
http://localhost:5000/movies/upcoming\n
http://localhost:5000/movies/by-genre/:genreId\n
Tv Shows:\n
http://localhost:5000/tv/search\n
http://localhost:5000/tv/popular\n
http://localhost:5000/tv/top_rated\n
http://localhost:5000/tv/on_the_air\n
http://localhost:5000/tv/by-genre/:genreId`);
});
