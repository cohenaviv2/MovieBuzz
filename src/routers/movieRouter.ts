import express from "express";
import { 
    getPopularMovies,
    getNowPlayingMovies,
 } from '../controllers/movieController'

const router = express.Router();

router.get("/popular", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const popularMovies = await getPopularMovies(page);
    res.json(popularMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/now_playing", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const nowPlayingMovies = await getNowPlayingMovies(page);
    res.json(nowPlayingMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
