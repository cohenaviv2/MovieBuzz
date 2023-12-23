import express, {Request, Response} from "express";
import {
  searchMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  getMovieById,
} from "../controllers/MovieController"

const router = express.Router();

router.get("/by-id/:movieId", async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.movieId);
    const movie = await getMovieById(movieId);
    res.json(movie);
  } catch (error) {
    res.status(404).json({ error: "Error fetching movie by ID" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  const query = req.query.query as string | undefined;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  if (!query) {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }
  const results = await searchMovies(query,page);
  res.json(results);
});

router.get("/popular", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const popularMovies = await getPopularMovies(page);
    res.json(popularMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/now_playing", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const nowPlayingMovies = await getNowPlayingMovies(page);
    res.json(nowPlayingMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const upcomingMovies = await getUpcomingMovies(page);
    res.json(upcomingMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/by-genre/:genreId", async (req: Request, res: Response) => {
  const genreId = Number(req.params.genreId);
  const movies = await getMoviesByGenre(genreId);
  res.json(movies);
});


export default router;
