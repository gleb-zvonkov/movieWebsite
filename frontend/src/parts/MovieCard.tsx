/**
 * MovieCard Component
 *
 * This component renders a movie card displaying the movie's backdrop image and embeds a YouTube player.
 * It is designed to show the movie's information when hovered, and the video will start playing when hovered over.
 * 
 * Props:
 * - `movie`: The movie object containing data like id, title, release date, backdrop path, YouTube ID, and streaming provider.
 * - `onHover`: Function triggered when the user hovers over the movie card (e.g., to start playing the video).
 * - `onLeave`: Function triggered when the mouse leaves the movie card (e.g., to pause the video).
 */

import { Movie } from "../types"; 

export default function MovieCard({
  movie,
  onHover,
  onLeave,
}: {
  movie: Movie;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      key={movie.id}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
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
        style={{
          position: "absolute",
          bottom: "10px", // Adjust the bottom margin as needed
          left: "10px", // Adjust the left margin as needed
          zIndex: 3, // Ensure it appears above the image
          color: "white", // Set text color to white for visibility
          fontWeight: "bold", // Make the text bold for better visibility
          fontSize: "16px", // Adjust font size as needed
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Add a subtle shadow for better readability
        }}
        className="movie-title"
      >
        {movie.title} {/* Movie title displayed here */}
      </div>

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
          pointerEvents: "auto",
        }}
        className="youtube-player"
      ></div>
    </div>
  );
}
