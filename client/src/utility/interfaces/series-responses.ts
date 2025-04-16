export interface IGeneralSeriesRes {
  message: string;
  series: {
    id: string;
    title: string;
    description: string;
    seasons: number;
    poster_src: string;
    thumb_src: string;
    release_date: string;
    genres: { Genre: { id: string; genre: string } }[];
  };
}

export interface IFullSeriesDataRes {
  id: string;
  title: string;
  description: string;
  seasons: number;
  release_date: string;
  poster_src: string;
  thumb_src: string;
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
