import initServer from "./server";

initServer().then((app) => {
  const PORT = process.env.SERVER_PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}\n\nMovies:\n
    http://localhost:5000/movies/search
    http://localhost:5000/movies/popular
    http://localhost:5000/movies/now_playing
    http://localhost:5000/movies/upcoming
    http://localhost:5000/movies/by-genre/:genreId\n
    Tv Shows:\n
    http://localhost:5000/tv/search
    http://localhost:5000/tv/popular
    http://localhost:5000/tv/top_rated
    http://localhost:5000/tv/on_the_air
    http://localhost:5000/tv/by-genre/:genreId`);
  });
});
``