import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMoviesManager } from "../utility/interfaces/redux-store";
import { IGeneralMovieDataRes } from "../utility/interfaces/movies-responses";

const initialState: IMoviesManager = {
  addNewMovie: {
    title: "",
    description: "",
    duration: 0,
    release_date: "",
    en_subtitles: false,
    bg_subtitles: false,
    genres: [],
  },
  updateMovie: {
    titleSearch: "",
    updatedPayload: {
      id: "",
      title: "",
      description: "",
      duration: 0,
      release_date: "",
      en_subtitles: false,
      bg_subtitles: false,
      genres: [],
    },
  },
  deleteMovie: {
    titleSearch: "",
    movieData: {
      id: "",
      title: "",
      description: "",
      duration: 0,
      release_date: "",
    },
  },
};

const movieManagerSlice = createSlice({
  name: "movies_manager",
  initialState,
  reducers: {
    setNewMovieTitle: (state, action: PayloadAction<string>) => {
      state.addNewMovie.title = action.payload;
    },
    setNewMovieDescription: (state, action: PayloadAction<string>) => {
      state.addNewMovie.description = action.payload;
    },
    setNewMovieDuration: (state, action: PayloadAction<number>) => {
      state.addNewMovie.duration = action.payload;
    },
    setNewReleaseDate: (state, action: PayloadAction<string>) => {
      state.addNewMovie.release_date = action.payload;
    },
    setNewMovieEnSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewMovie.en_subtitles = action.payload;
    },
    setNewMovieBgSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewMovie.bg_subtitles = action.payload;
    },
    addNewMovieGenre: (state, action: PayloadAction<string>) => {
      const genreId = action.payload;
      const alreadyExists = state.addNewMovie.genres.find((g) => g === genreId);
      if (alreadyExists) {
        state.addNewMovie.genres = state.addNewMovie.genres.filter(
          (g) => g != alreadyExists
        );
      } else {
        state.addNewMovie.genres.push(genreId);
      }
    },
    resetNewMovieValues: (state) => {
      state.addNewMovie = { ...initialState.addNewMovie };
    },
    setTitleSearch: (state, action: PayloadAction<string>) => {
      state.updateMovie.titleSearch = action.payload;
    },
    setFetchedUpdatedMovieData: (
      state,
      action: PayloadAction<IGeneralMovieDataRes>
    ) => {
      state.updateMovie.updatedPayload = {
        ...action.payload.movie,
        genres: action.payload.movie.genres.map((g) => g.Genre.id),
      };
    },
    setUpdatedMovieTitle: (state, action: PayloadAction<string>) => {
      state.updateMovie.updatedPayload.title = action.payload;
    },
    setUpdatedMovieDescription: (state, action: PayloadAction<string>) => {
      state.updateMovie.updatedPayload.description = action.payload;
    },
    setUpdatedMovieDuration: (state, action: PayloadAction<number>) => {
      state.updateMovie.updatedPayload.duration = action.payload;
    },
    setUpdatedReleaseDate: (state, action: PayloadAction<string>) => {
      state.updateMovie.updatedPayload.release_date = action.payload;
    },
    setUpdatedMovieEnSubtitles: (state, action: PayloadAction<boolean>) => {
      state.updateMovie.updatedPayload.en_subtitles = action.payload;
    },
    setUpdatedMovieBgSubtitles: (state, action: PayloadAction<boolean>) => {
      state.updateMovie.updatedPayload.bg_subtitles = action.payload;
    },
    addUpdatedMovieGenre: (state, action: PayloadAction<string>) => {
      const genreId = action.payload;
      const alreadyExists = state.updateMovie.updatedPayload.genres.find(
        (g) => g === genreId
      );
      if (alreadyExists) {
        state.updateMovie.updatedPayload.genres =
          state.updateMovie.updatedPayload.genres.filter(
            (g) => g != alreadyExists
          );
      } else {
        state.updateMovie.updatedPayload.genres.push(genreId);
      }
    },
    resetUpdatedMovieValues: (state) => {
      state.updateMovie.titleSearch = "";
      state.updateMovie.updatedPayload = {
        ...initialState.updateMovie.updatedPayload,
      };
    },
    setDeletedTitleSearch: (state, action: PayloadAction<string>) => {
      state.deleteMovie.titleSearch = action.payload;
    },
    setDeleteMovieData: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        description: string;
        duration: number;
        release_date: string;
      }>
    ) => {
      state.deleteMovie.movieData = { ...action.payload };
    },
    resetDeletedMovieValues: (state) => {
      state.deleteMovie = { ...initialState.deleteMovie };
    },
  },
});

export const {
  setNewMovieTitle,
  setNewMovieDescription,
  setNewMovieDuration,
  setNewReleaseDate,
  setNewMovieEnSubtitles,
  setNewMovieBgSubtitles,
  addNewMovieGenre,
  resetNewMovieValues,
  setTitleSearch,
  setFetchedUpdatedMovieData,
  setUpdatedMovieTitle,
  setUpdatedMovieDescription,
  setUpdatedMovieDuration,
  setUpdatedReleaseDate,
  setUpdatedMovieEnSubtitles,
  setUpdatedMovieBgSubtitles,
  addUpdatedMovieGenre,
  resetUpdatedMovieValues,
  setDeletedTitleSearch,
  setDeleteMovieData,
  resetDeletedMovieValues,
} = movieManagerSlice.actions;
export default movieManagerSlice.reducer;
