/**
 * GET /api/recommended - Fetches and returns recommended movies.
 *
 * Uses the `getRandomPopularMovies` function to retrieve the default top 10 recommended movies.
 * Returns a 500 error if the movie data cannot be fetched.
 */
import express from "express";
import { getRandomPopularMovies } from "../movieInfo/movieBuilder.js"; // Import the function to fetch movies

const router = express.Router();

router.get("/", async (req, res) => {
  // Recommended movies route
  try {
    const movie = await getRandomPopularMovies(); // default is top 10
    res.json(movie);
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
    res.status(500).json({ error: "Failed to fetch recommended movie data" });
  }
});

export const recommendedMoviesRouter = router;
