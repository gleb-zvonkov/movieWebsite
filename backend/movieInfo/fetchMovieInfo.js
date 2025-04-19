/**
 * This module contains functions for interacting with the TMDb API:
 * - Get movie details by TMDb ID
 * - Search for movies by title
 * - Retrieve trending, top-rated movies
 * - Get streaming provider information for a movie
 * Each function uses the TMDb API with an authorization token.
 */

//Define the API key for TMDb API
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.TMDB_API_KEY;


// Fetches movie data from TMDb using its tmdbID.
// Returns the full movie details as a JSON object.
export async function getMovieById(tmdbId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
    options
  );
  const data = await res.json();
  return data;
}

// Searches for movies by title and returns a list of search results.
// Uses the TMDb search API to find movies by title.
export async function searchMovieByTitle(movieName) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1`,
    options
  );
  const data = await res.json();
  return data;
}

// Searches for a movie by title and returns the first search result.
// Uses the TMDb search API to find and return the first movie result.
export async function getMovieByTitle(movieName) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1`,
    options
  );
  const data = await res.json();
  return data.results[0];
}

// Retrieves the top trending movies for the current day from TMDb.
// Uses the TMDb trending movies API to fetch daily trending movies.
export async function getTrendingMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?language=en-US`,
    options
  );
  const data = await res.json();
  console.log(data);
  return data.results;
}

// Retrieves the top-rated movies from TMDb.
// Uses the TMDb top-rated movies API to fetch the list of top-rated movies.
export async function getTopRatedMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`,
    options
  );
  const data = await res.json();
  return data.results;
}

// Retrieves the streaming provider for a given movie by tmdbId.
// Uses the TMDb API to find the streaming provider for a movie.
export async function getStreamingProvider(tmdbId) {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };

  try {
    const response = await fetch(url, { method: "GET", headers: headers });

    if (response.ok) {
      const data = await response.json();

      if ("CA" in data.results) {
        const caData = data.results.CA;

        if (caData.flatrate && caData.flatrate.length > 0) {
          const firstFlatrateResult = caData.flatrate[0];
          const providerName = firstFlatrateResult.provider_name;
          return providerName;
        }
      }
    } else {
      console.error(`Failed to retrieve data. Status Code: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error during fetch: ${error.message}`);
  }
  return null;
}
