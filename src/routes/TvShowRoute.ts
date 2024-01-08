import express, { Request, Response } from "express";
import { searchTvShows, getPopularTvShows, getTopRatedTvShows, getOnAirTvShows, getTvShowsByGenre, getTvShowById } from "../controllers/TvShowsController";

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
  if (results.length == 0) {
    res.status(404).send("No TV Shows found");
  } else {
    res.json(results);
  }
});
/**
 * @swagger
 * /tv/search:
 *   get:
 *     summary: Search for TV shows based on a query
 *     tags: [TV Shows]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with search results for TV shows
 *       404:
 *         description: No TV Shows found for the given query.
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 */

router.get("/popular", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const popularShows = await getPopularTvShows(page);
    res.json(popularShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /tv/popular:
 *   get:
 *     summary: Get a list of popular TV shows
 *     tags: [TV Shows]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with a list of popular TV shows
 *       500:
 *         description: Internal Server Error. An error occurred while fetching popular TV shows.
 */

router.get("/top-rated", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const topRatedShows = await getTopRatedTvShows(page);
    res.json(topRatedShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /tv/top-rated:
 *   get:
 *     summary: Get a list of top-rated TV shows
 *     tags: [TV Shows]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with a list of top-rated TV shows
 *       500:
 *         description: Internal Server Error. An error occurred while fetching top-rated TV shows.
 */

router.get("/on-the-air", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const onAirShows = await getOnAirTvShows(page);
    res.json(onAirShows);
  } catch (error) {
    console.error("Error fetching popular Shows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /tv/on-the-air:
 *   get:
 *     summary: Get a list of TV shows currently on the air
 *     tags: [TV Shows]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with a list of TV shows on the air
 *       500:
 *         description: Internal Server Error. An error occurred while fetching on-the-air TV shows.
 */

router.get("/by-genre/:genreId", async (req: Request, res: Response) => {
  const genreId = Number(req.params.genreId);
  const shows = await getTvShowsByGenre(genreId);
  res.json(shows);
});

export default router;
