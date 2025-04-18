import { useState } from "react";
import { Movie } from "../types"; // adjust path if needed

export function useMovieLoader(initialMovies: Movie[] = []) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const addMovies = (newMovies: Movie[]) => {
    setMovies((prev) => [...prev, ...newMovies]);
  };

  const fetchAndAddMovie = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/one_movie");
      const newMovies: Movie[] = await res.json();
      addMovies(newMovies);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  return { movies, setMovies, fetchAndAddMovie };
}
