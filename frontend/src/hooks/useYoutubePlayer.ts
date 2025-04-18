import { useEffect, useRef } from "react";
import { Movie } from "../types"; // adjust path if needed

export function useYouTubePlayers(movies: Movie[], loading: boolean) {
  const playerRefs = useRef<{ [key: number]: any | null }>({});

  const createPlayer = (movieId: number, youtubeId: string) => {
    new (window as any).YT.Player(`player${movieId}`, {
      videoId: youtubeId,
      playerVars: {
        controls: 0,
        rel: 0,
        start: 10,
        mute: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          playerRefs.current[movieId] = event.target;
        },
      },
    });
  };

  useEffect(() => {
    if (!loading && (window as any).YT?.Player) {
      movies.forEach((movie) => {
        if (!playerRefs.current[movie.id]) {
          createPlayer(movie.id, movie.youtubeId);
        }
      });
    }
  }, [loading, movies]);

  return playerRefs;
}
