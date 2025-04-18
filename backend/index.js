import express from 'express';
import cors from 'cors';
import {
  landingPageMovies,
  getRandomPopularMovies
} from './movieBuilder.js';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { uploadRouter } from "./routes/upload.js";
import { gptRouter } from "./routes/gptRouter.js";

const app = express();
const PORT = 5050;

app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend URL
    credentials: true, // allow credentials like cookies or auth headers
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));   //for better auth 

app.use(express.json()); // automatically parse incoming requests with a Content-Type of application/json

app.use("/api", uploadRouter);  //for upload images to deep ocean

app.get('/api/trending', async (req, res) => {
  try {
    const movies = await landingPageMovies(); // default is top 10
    res.json(movies);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({ error: 'Failed to fetch trending movie data' });
  }
})

app.get('/api/one_movie', async (req, res) => {
  try {
    const movie = await getRandomPopularMovies(); // default is top 10
    res.json(movie);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({ error: 'Failed to fetch trending movie data' });
  }
})

app.use("/api", gptRouter);  //for upload images to deep ocean



//Listen to incoming requests
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});