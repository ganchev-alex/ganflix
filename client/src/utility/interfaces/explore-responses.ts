export interface IRecent {
  id: string;
  title: string;
  description: string;
  seasons?: number;
  duration?: number;
  thumb_src: string;
  poster_src: string;
  release_date: string;
  Genres: { genre: string }[];
  Listings: { id: string; name: string }[];
}

export interface IGeneralRecord {
  id: string;
  title: string;
  description: string;
  seasons?: number;
  duration?: number;
  thumb_src: string;
  poster_src: string;
  release_date: string;
  Genres: { genre: string }[];
  Listings: { id: string; name: string }[];
}

export interface ILoadedEpsiode {
  id: string;
  series_id: string;
  title: string;
  episode_num: string;
  season: number;
  duration: number;
  stream_src: string;
  en_subtitles: string;
  bg_subtitles: string;
}

export interface ILoadedRecord {
  id: string;
  title: string;
  description: string;
  seasons?: number;
  duration?: number;
  thumb_src: string;
  poster_src: string;
  release_date: string;
  stream_src?: string;
  en_subtitles?: string;
  bg_subtitles?: string;
  Episodes?: ILoadedEpsiode[];
  Genres: { genre: string; id: string }[];
  Listings: { id: string; name: string; icon_src: string }[];
  Collections: {
    id: string;
    name: string;
    icon_src: string;
  }[];
  Personalization: {
    notes: string;
    rating: number;
  };
}
