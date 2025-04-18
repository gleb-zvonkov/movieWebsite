type Movie = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string;
  youtubeId: string;
  streamingProvider: string;
};

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
