export interface IGeneralMovieDataRes {
  message: string;
  movie: {
    id: string;
    title: string;
    description: string;
    duration: number;
    release_date: string;
    en_subtitles: boolean;
    bg_subtitles: boolean;
    genres: { Genre: { id: string; genre: string } }[];
  };
}

export interface IFullMovieDataRes {
  id: string;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  poster_src: string;
  thumb_src: string;
  stream_src: string;
  en_subtitles: boolean;
  bg_subtitles: boolean;
  genres: { id: string; genre: string }[];
  listings: { id: string; name: string; icon_src: string }[];
  collections: {
    id: string;
    name: string;
    icon_src: string;
  }[];
  personalization: {
    notes: string;
    rating: number;
  };
}
