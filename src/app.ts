import express from "express";
import movieRouter from "./routes/movieRouter";
import tvShowsRouter from "./routes/tvShowsRouter"
import "dotenv/config";

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use("/movies", movieRouter);
app.use("/tv",tvShowsRouter);

app.listen(port, () => {
  console.log(`

Server is running on http://localhost:${port}
  
Movies:

http://localhost:5000/movies/search
http://localhost:5000/movies/popular
http://localhost:5000/movies/now_playing
http://localhost:5000/movies/upcoming
http://localhost:5000/movies/by-genre/35 (Comedy)\n
Tv Shows:

http://localhost:5000/tv/search
http://localhost:5000/tv/popular
http://localhost:5000/tv/top_rated
http://localhost:5000/tv/on_the_air
http://localhost:5000/tv/by-genre/10759 (Action & Adventure)`);
});
