import { IGenre } from "./genres-responses";
import { IListing } from "./listings-responses";

export interface ICosmetics {
  backlights: {
    colorful: string | null;
  };
}

export interface IMoviesManager {
  addNewMovie: {
    title: string;
    description: string;
    duration: number;
    release_date: string;
    en_subtitles: boolean;
    bg_subtitles: boolean;
    genres: string[];
  };
  updateMovie: {
    titleSearch: string;
    updatedPayload: {
      id: string;
      title: string;
      description: string;
      duration: number;
      release_date: string;
      en_subtitles: boolean;
      bg_subtitles: boolean;
      genres: string[];
    };
  };
  deleteMovie: {
    titleSearch: string;
    movieData: {
      id: string;
      title: string;
      description: string;
      duration: number;
      release_date: string;
    };
  };
}

export interface INewEpisode {
  title: string;
  season: number;
  episode_num: number;
  duration: number;
  en_subtitles: boolean;
  bg_subtitles: boolean;
}

export interface ISeriesManager {
  addNewSeries: {
    seriesData: {
      title: string;
      description: string;
      seasons: number;
      release_date: string;
      genres: string[];
    };
    episodesPayload: INewEpisode[];
    addNewEpisode: INewEpisode;
  };
  updateSeries: {
    titleSearch: string;
    updatedPayload: {
      id: string;
      title: string;
      description: string;
      seasons: number;
      release_date: string;
      genres: string[];
    };
  };
  addNewSeason: {
    titleSearch: string;
    newEpisode: INewEpisode;
    newSeason: {
      series_id: string;
      episodes: INewEpisode[];
    };
  };
  addNewEpisodes: {
    titleSearch: string;
    newEpisode: INewEpisode;
    series_id: string;
    episodes: INewEpisode[];
  };
  deleteSeries: {
    titleSearch: string;
    seriesData: {
      id: string;
      title: string;
      description: string;
      seasons: number;
      release_date: string;
    };
  };
  deleteSeason: {
    titleSearch: string;
    season: number;
    seriesData: {
      id: string;
      title: string;
      description: string;
      seasons: number;
      release_date: string;
    };
  };
}

export interface IExplore {
  searchValue: string;
  type: "All" | "Movies" | "Series";
  filters: {
    orderBy:
      | "Most Recently Added"
      | "Least Recently Added"
      | "Latest Releases"
      | "Earliest Releases"
      | "By Title A-to-Z"
      | "By Title Z-to-A";
    listing: IListing;
    genre: IGenre;
    year: string;
  };
  pagination: {
    totalResults: number;
    currentPage: number;
    pageLimit: number;
    totalPages: number;
  };
}

export interface IStream {
  resumeTime: number;
  activeId?: string;
}

export interface ICatalogues {
  catalogueKind: "listings" | "collections";
  catalogueId: string;
}
