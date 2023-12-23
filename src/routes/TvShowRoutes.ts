import express, {Request, Response} from "express";
import {
  searchTvShows,
  getPopularTvShows,
  getTopRatedTvShows,
  getOnAirTvShows,
  getTvShowsByGenre,
  getTvShowById
} from "../controllers/TvShowsController";

const router = express.Router();

router.get("/by-id/:showId", async (req: Request, res: Response) => {
  try {
    const showId = Number(req.params.showId);
    const show = await getTvShowById(showId);
    res.json(show);
  } catch (error) {
    res.status(404).json({ error: "Error fetching tv show by ID" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  const query = req.query.query as string | undefined;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  if (!query) {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }
  const results = await searchTvShows(query, page);
  res.json(results);
});

router.get("/popular", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const popularShows = await getPopularTvShows(page);
    res.json(popularShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/top_rated", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const topRatedShows = await getTopRatedTvShows(page);
    res.json(topRatedShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/on_the_air", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Parse page parameter from query string
    const onAirShows = await getOnAirTvShows(page);
    res.json(onAirShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/by-genre/:genreId", async (req: Request, res: Response) => {
  const genreId = Number(req.params.genreId);
  const shows = await getTvShowsByGenre(genreId);
  res.json(shows);
});

export default router;
