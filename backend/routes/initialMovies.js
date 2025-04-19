/**
 * GET /api/trending - Fetches and returns the top trending movies.
 *
 * Uses the `landingPageMovies` function to retrieve the default top 10 movies.
 * Returns a 500 error if the movie data cannot be fetched.
 */

import express from "express";
import { landingPageMovies } from "../movieInfo/movieBuilder.js"; // Import the function to fetch movies

const router = express.Router();

router.get("/", async (req, res) => {
  // Landing page movies route
  try {
    const movies = await landingPageMovies(); // default is top 10
    res.json(movies);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    res.status(500).json({ error: "Failed to fetch trending movie data" });
  }
});

export const trendingMoviesRouter = router;
