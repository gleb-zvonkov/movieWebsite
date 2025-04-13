import express from 'express';
import cors from 'cors';
import {
  landingPageMovies,
  oneMovie, 
  getRandomPopularMovies
} from './movieBuilder.js';

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

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



app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});