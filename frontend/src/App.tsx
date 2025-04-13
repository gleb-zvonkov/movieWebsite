import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  type Movie = {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    backdrop_path: string;
    youtubeId: string;
    streamingProvider: string;
  };

  //Initializes movies as an empty array. setMovies is the function used to update it.
  const [movies, setMovies] = useState<Movie[]>([]); // State to hold the list of movies
  const [loading, setLoading] = useState(true); //for initial page load
  const playerRefs = useRef<{ [key: number]: any | null }>({});

  // Load trending movies initially
  useEffect(() => {
    fetch("http://localhost:5050/api/trending")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
        console.log("Trending movies loaded");
        console.log(data);
      })
      .catch((err) => {
        console.error("Error loading trending movies:", err);
        setLoading(false);
      });
  }, []);

  //Create YouTube Player for each movie
  const createPlayer = (movieId: number, youtubeId: string) => {
    const player = new (window as any).YT.Player(`player${movieId}`, {
      videoId: youtubeId,
      playerVars: {
        controls: 0,
        rel: 0,
        start: 10,
        mute: 0, // autoplay works only if muted
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          playerRefs.current[movieId] = event.target;
          console.log(movieId);
        },
      },
    });
  };

  useEffect(() => {
    //Only try to create YouTube players if the page has finished loading and the YouTube API is fully ready
    if (!loading && (window as any).YT && (window as any).YT.Player ) {
      movies.forEach((movie, index) => {
        // Loop through each movie
        createPlayer(movie.id, movie.youtubeId);   //use the movieId here instead of the index
      });
    }
  }, [loading, movies]); // Whenever the loading state or movies array changes, run this code.

  

  // Infinite scroll functionality
  useEffect(() => {
    let isFetching = false;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 100;

      if (scrollPosition >= threshold && !isFetching) {
        isFetching = true;
        fetchAndAddMovie().finally(() => {
          setTimeout(() => {
            isFetching = false;
          }, 500); // prevent rapid fire
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Function to add a new movie to the grid
  //When state updates, React re-renders the component with the new list of movies.
  const addMovies = (newMovies: Movie[]) => {
    setMovies((prev) => [...prev, ...newMovies]);
  };

  // Fetch one random movie and add it
  const fetchAndAddMovie = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/one_movie"); // update route
      const movies: Movie[] = await res.json();
      addMovies(movies);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <Input style={{ flex: 1 }} placeholder="Enter something..." />
        <Button>Enter</Button>
      </div>

      {loading ? (
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
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              onMouseEnter={() => playerRefs.current[movie.id]?.playVideo()}
              onMouseLeave={() => playerRefs.current[movie.id]?.pauseVideo()}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
              }}
              className="video-wrapper"
            >
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt={movie.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                  transition: "opacity 0.3s ease",
                  zIndex: 2,
                }}
                className="backdrop-image"
              />

              <div
                id={`player${movie.id}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  borderRadius: "8px",
                  overflow: "hidden",
                  pointerEvents: "auto", // Allow interaction
                }}
                className="youtube-player"
              ></div>
            </div>
          ))}
          <Skeleton className="w-full h-[300px] rounded-xl" />
        </div>
      )}
    </div>
  );
}

export default App;
