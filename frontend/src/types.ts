export type Movie = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string;
  youtubeId: string;
  streamingProvider: string;
};

export type User = {
  email: string;
  image?: string;
};


