import express, { Request, Response } from "express";
import { searchMovies, getPopularMovies, getNowPlayingMovies, getUpcomingMovies, getMoviesByGenre, getMovieById } from "../controllers/MovieController";

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
  const results = await searchMovies(query, page);
  if (results.length == 0) {
    res.status(404).send("No movies found");
  } else {
    res.json(results);
  }
});
/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search for movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: The search query for movies
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with search results
 *       404:
 *         description: No movies found for the given query.
 *       500:
 *         description: Internal Server Error. An error occurred while searching for movies.
 */

router.get("/popular", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const popularMovies = await getPopularMovies(page);
    res.json(popularMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /movies/popular:
 *   get:
 *     summary: Get a list of popular movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with a list of popular movies
 *       500:
 *         description: Internal Server Error. An error occurred while fetching popular movies.
 */

router.get("/now-playing", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const nowPlayingMovies = await getNowPlayingMovies(page);
    res.json(nowPlayingMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /movies/now-playing:
 *   get:
 *     summary: Get a list of now playing movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with a list of now playing movies
 *       500:
 *         description: Internal Server Error. An error occurred while fetching now playing movies.
 */

router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const upcomingMovies = await getUpcomingMovies(page);
    res.json(upcomingMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /movies/upcoming:
 *   get:
 *     summary: Get a list of upcoming movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successful response with a list of upcoming movies
 *       500:
 *         description: Internal Server Error. An error occurred while fetching upcoming movies.
 */

router.get("/by-genre/:genreId", async (req: Request, res: Response) => {
  const genreId = Number(req.params.genreId);
  const movies = await getMoviesByGenre(genreId);
  res.json(movies);
});

export default router;
