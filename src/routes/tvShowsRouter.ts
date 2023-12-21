import express from "express";
import {
  searchTvShows,
  getPopularTvShows,
  getTopRatedTvShows,
  getOnAirTvShows,
  getTvShowsByGenre,
} from "../controllers/tvShowsController";

const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.query as string | undefined;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  if (!query) {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }
  const results = await searchTvShows(query,page);
  res.json(results);
});

router.get("/popular", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const popularShows = await getPopularTvShows(page);
    res.json(popularShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/top_rated", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const topRatedShows = await getTopRatedTvShows(page);
    res.json(topRatedShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/on_the_air", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const onAirShows = await getOnAirTvShows(page);
    res.json(onAirShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/by-genre/:genreId", async (req, res) => {
  const genreId = Number(req.params.genreId);
  const Shows = await getTvShowsByGenre(genreId);
  res.json(Shows);
});

export default router;
