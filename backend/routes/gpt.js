/**
 * POST /api/gpt - Generates movie recommendations using OpenAI's GPT model.
 * 
 * Takes a query, sends it to GPT, and returns a list of movie objects based on the response.
 * If the query is missing or an error occurs, returns appropriate error messages.
 * 
 * Dependencies: Express, OpenAI, `createMovieObjectFromName` from `movieBuilder.js`.
 */

import express from "express";
import OpenAI from "openai";
import { createMovieObjectFromName } from "../movieInfo/movieBuilder.js"; // Import the function to create movie objects

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { query } = req.body; // Extract query from the request body

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a movie recommender, output only movie names seperated by commas.",
      }, // Optional: Define system-level instructions
      { role: "user", content: query }, // Use the specified role for the query
    ];

    // Make request to OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Model you're using
      messages: messages,
    });

    // Send GPT's response back to the client
    const gptResponse = response.choices[0].message.content;

    // Split the results by commas, remove leading/trailing spaces
    const results = gptResponse.split(",").map((movie) => movie.trim());

    // Process each movie asynchronously
    const results2 = await Promise.all(
      results.map(async (movie) => {
        const movieObject = await createMovieObjectFromName(movie); // Create movie object using the imported function
        return movieObject;
      })
    );

    res.json(results2);
  } catch (error) {
    console.error("Error querying GPT:", error);
    res.status(500).json({ error: "Failed to get response from GPT" });
  }
});

export const gptRouter = router;
