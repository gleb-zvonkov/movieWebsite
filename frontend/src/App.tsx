import "./App.css";
import { useState, useEffect, useRef } from "react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// my components
import AvatarDemo from "@/parts/avatar";
import LoginCard from "@/parts/loginCard";
import MovieCard from "@/parts/MovieCard";

// hooks
import { useYouTubePlayers } from "@/hooks/useYoutubePlayer";
import { useMovieLoader } from "@/hooks/useMovieLoader";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

function App() {
  const { movies, setMovies, fetchAndAddMovie } = useMovieLoader(); // Loads and manages the movie list (initial + incremental loading)
  const [loading, setLoading] = useState(true); // Controls the loading state for the initial movie grid (the initial 8 movies)
  const playerRefs = useYouTubePlayers(movies, loading); // Initializes and stores references to YouTube players using movie IDs
  const [showLogin, setShowLogin] = useState(false); // Controls whether the login popup is visible
  const [searchQuery, setSearchQuery] = useState(""); // Tracks the input text for the search
  const [loadingMovies, setLoadingMovies] = useState(false); // Controls whether movies are loading after input query

  // Load trending movies initially
  useEffect(() => {
    fetch("http://localhost:5050/api/trending")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data); // once the movies are fetched
        setLoading(false); // no longer show the loading state
      })
      .catch((err) => {
        console.error("Error loading trending movies:", err);
        setLoading(false);
      });
  }, []);

  useInfiniteScroll(fetchAndAddMovie); // Attaches a scroll listener and loads a new movie from the backend when the user nears the bottom of the page.

  // Function to handle search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLoadingMovies(true); // Start loading movies
      fetch("http://localhost:5050/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }), // Send the input query to the backend
      })
        .then((res) => res.json())
        .then((data) => {
          setMovies(data); // Update the movie list with the fetched movies
          setLoadingMovies(false); // Stop loading state
        })
        .catch((err) => {
          console.error("Error fetching movies from GPT:", err);
          setLoadingMovies(false); // Stop loading state in case of error
        });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{ position: "absolute", top: "20px", left: "20px", zIndex: 999 }}
      >
        <AvatarDemo onClick={() => setShowLogin(!showLogin)} />
      </div>

      {/* Login popup: Opens or closes the login card when clicked. */}
      {showLogin && <LoginCard />}

      {/* Search Bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <Input
          style={{ flex: 1, height: "50px", fontSize: "16px" }}
          placeholder="What type of movie are you looking for ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update the searchQuery state
        />
        <Button
          style={{ height: "50px" }}
          onClick={handleSearch} // Handle button click to trigger search
        >
          Enter
        </Button>
      </div>

      {/* Movie Grid */}
      {/* Shows loading skeletons while movies are loading. */}
      {loadingMovies ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "16px",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
          ))}
        </div>
      ) : loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "16px",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Displays each movie in a MovieCard */}
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onHover={() => playerRefs.current[movie.id]?.playVideo()}
              onLeave={() => playerRefs.current[movie.id]?.pauseVideo()}
            />
          ))}
          <Skeleton className="w-full h-[300px] rounded-xl" />
        </div>
      )}
    </div>
  );
}

export default App;
