import { useState } from "react";
import { Movie } from "../types"; // adjust path if needed
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Custom hook for loading and managing a list of movies.
 * 
 * This hook provides functionality to:
 * - Store a list of movies in state.
 * - Add new movies to the existing list.
 * - Fetch additional movies from the backend and add them to the list.
 **/

export function useMovieLoader(initialMovies: Movie[] = []) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const addMovies = (newMovies: Movie[]) => {
    setMovies((prev) => [...prev, ...newMovies]);
  };

  const fetchAndAddMovie = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/recommended`);
      const newMovies: Movie[] = await res.json();
      addMovies(newMovies);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  return { movies, setMovies, fetchAndAddMovie };
}
