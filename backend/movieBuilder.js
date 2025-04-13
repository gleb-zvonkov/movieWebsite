import Database from "better-sqlite3";
import {
  getMovieById,
  getMovieByTitle,
  getStreamingProvider,
  getYoutubeId,
  getTrendingMovies,
  getTopRatedMovies,
} from "./tmdbFetchFunctions.js";

function extractMovieInfo(movie) {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    backdrop_path: movie.backdrop_path,
  };
}

async function buildMovieObject(movie) {
  const youtubeId = await getYoutubeId(movie.title);
  const streamingProvider = await getStreamingProvider(movie.id);
  return {
    ...extractMovieInfo(movie),
    youtubeId,
    streamingProvider,
  };
}

export async function createMovieObjectFromID(tmdbId) {
  const movie = await getMovieById(tmdbId);
  return buildMovieObject(movie);
}

export async function createMovieObjectFromName(title) {
  const movie = await getMovieByTitle(title);
  return buildMovieObject(movie);
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function shuffleArray(array) {
  return [...array].sort(() => 0.5 - Math.random());
}

export async function landingPageMovies() {
  // Fetch raw movies
  const trending = await getTrendingMovies();
  const topRated = await getTopRatedMovies();

  // Select random ones
  const trendingSample = getRandomItems(trending, 8);
  const topRatedSample = getRandomItems(topRated, 2);

  // Combine and shuffle them
  const combined = [...trendingSample, ...topRatedSample];
  const shuffled = shuffleArray(combined);

  // Build movie objects
  const movieObjects = await Promise.all(
    shuffled.map((movie) => buildMovieObject(movie))
  );

  return movieObjects;
}

export async function oneMovie() {
  const id = 550;
  const ids = [550, 862];
  const movie = await createMovieObjectFromID(id);

  //return movie;

  const movies = await Promise.all(
    ids.map((id) => createMovieObjectFromID(id))
  );

  return movies;
}


export async function getRandomPopularMovies() {
  const db = new Database("movies.db");

  // Step 1: Select top 100 most popular movies
  const topMovies = db
    .prepare("SELECT * FROM movies ORDER BY popularity DESC LIMIT 1000")
    .all();

  // Step 2: Shuffle and pick 10 at random
  const shuffled = topMovies.sort(() => 0.5 - Math.random());
  const randomIds = shuffled.slice(0, 10).map((movie) => movie.id);

  db.close();

  // Build movie objects in parallel
  const movieObjects = await Promise.all(
    randomIds.map(id => createMovieObjectFromID(id))
  );

  console.log(movieObjects);

  return movieObjects;
}



