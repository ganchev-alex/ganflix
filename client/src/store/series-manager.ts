import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INewEpisode, ISeriesManager } from "../utility/interfaces/redux-store";
import { IGeneralSeriesRes } from "../utility/interfaces/series-responses";

const initialState: ISeriesManager = {
  addNewSeries: {
    seriesData: {
      title: "",
      description: "",
      seasons: 0,
      release_date: "",
      genres: [],
    },
    episodesPayload: [],
    addNewEpisode: {
      title: "",
      season: 0,
      episode_num: 0,
      duration: 0,
      en_subtitles: false,
      bg_subtitles: false,
    },
  },
  updateSeries: {
    titleSearch: "",
    updatedPayload: {
      id: "",
      title: "",
      description: "",
      seasons: 0,
      release_date: "",
      genres: [],
    },
  },
  addNewSeason: {
    titleSearch: "",
    newEpisode: {
      title: "",
      season: 0,
      episode_num: 0,
      duration: 0,
      en_subtitles: false,
      bg_subtitles: false,
    },
    newSeason: {
      series_id: "",
      episodes: [],
    },
  },
  addNewEpisodes: {
    titleSearch: "",
    newEpisode: {
      title: "",
      season: 0,
      episode_num: 0,
      duration: 0,
      en_subtitles: false,
      bg_subtitles: false,
    },
    series_id: "",
    episodes: [],
  },
  deleteSeries: {
    titleSearch: "",
    seriesData: {
      id: "",
      title: "",
      description: "",
      seasons: 0,
      release_date: "",
    },
  },
  deleteSeason: {
    titleSearch: "",
    season: 0,
    seriesData: {
      id: "",
      title: "",
      description: "",
      seasons: 0,
      release_date: "",
    },
  },
};

const seriesManagerSlice = createSlice({
  name: "series_manager",
  initialState,
  reducers: {
    setNewSeriesTitle: (state, action: PayloadAction<string>) => {
      state.addNewSeries.seriesData.title = action.payload;
    },
    setNewSeriesDescription: (state, action: PayloadAction<string>) => {
      state.addNewSeries.seriesData.description = action.payload;
    },
    setNewSeriesSeasons: (state, action: PayloadAction<number>) => {
      state.addNewSeries.seriesData.seasons = action.payload;
    },
    setNewSeriesReleaseDate: (state, action: PayloadAction<string>) => {
      state.addNewSeries.seriesData.release_date = action.payload;
    },
    setNewSeriesGenre: (state, action: PayloadAction<string>) => {
      const genreId = action.payload;
      const alreadyExists = state.addNewSeries.seriesData.genres.find(
        (g) => g === genreId
      );
      if (alreadyExists) {
        state.addNewSeries.seriesData.genres =
          state.addNewSeries.seriesData.genres.filter(
            (g) => g != alreadyExists
          );
      } else {
        state.addNewSeries.seriesData.genres.push(genreId);
      }
    },
    setNewEpisodeTitle: (state, action: PayloadAction<string>) => {
      state.addNewSeries.addNewEpisode.title = action.payload;
    },
    setNewEpisodeSeason: (state, action: PayloadAction<number>) => {
      state.addNewSeries.addNewEpisode.season = action.payload;
    },
    setNewEpisodeEpisodeNum: (state, action: PayloadAction<number>) => {
      state.addNewSeries.addNewEpisode.episode_num = action.payload;
    },
    setNewEpisodeDuration: (state, action: PayloadAction<number>) => {
      state.addNewSeries.addNewEpisode.duration = action.payload;
    },
    setNewEpisodeEnSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewSeries.addNewEpisode.en_subtitles = action.payload;
    },
    setNewEpisodeBgSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewSeries.addNewEpisode.bg_subtitles = action.payload;
    },
    addToEpisodePayload: (state) => {
      state.addNewSeries.episodesPayload.push(state.addNewSeries.addNewEpisode);
      state.addNewSeries.addNewEpisode = {
        ...initialState.addNewSeries.addNewEpisode,
        season: state.addNewSeries.episodesPayload[0].season,
      };
    },
    removeFromEpisodePayload: (state, action: PayloadAction<number>) => {
      state.addNewSeries.episodesPayload =
        state.addNewSeries.episodesPayload.filter(
          (ep) =>
            ep.title !==
            state.addNewSeries.episodesPayload[action.payload].title
        );
    },
    resetNewSeriesData: (state) => {
      state.addNewSeries = { ...initialState.addNewSeries };
    },
    setUpdatedTitleSearch: (state, action: PayloadAction<string>) => {
      state.updateSeries.titleSearch = action.payload;
    },
    setFetchedUpdatedSeriesData: (
      state,
      action: PayloadAction<IGeneralSeriesRes>
    ) => {
      state.updateSeries.updatedPayload = {
        ...action.payload.series,
        genres: action.payload.series.genres.map((g) => g.Genre.id),
      };
    },
    setUpdatedSeriesTitle: (state, action: PayloadAction<string>) => {
      state.updateSeries.updatedPayload.title = action.payload;
    },
    setUpdatedSeriesDescription: (state, action: PayloadAction<string>) => {
      state.updateSeries.updatedPayload.description = action.payload;
    },
    setUpdatedSeriesSeasons: (state, action: PayloadAction<number>) => {
      state.updateSeries.updatedPayload.seasons = action.payload;
    },
    setUpdatedSeriesReleaseDate: (state, action: PayloadAction<string>) => {
      state.updateSeries.updatedPayload.release_date = action.payload;
    },
    setUpdatedSeriesGenre: (state, action: PayloadAction<string>) => {
      const genreId = action.payload;
      const alreadyExists = state.updateSeries.updatedPayload.genres.find(
        (g) => g === genreId
      );
      if (alreadyExists) {
        state.updateSeries.updatedPayload.genres =
          state.addNewSeries.seriesData.genres.filter(
            (g) => g != alreadyExists
          );
      } else {
        state.updateSeries.updatedPayload.genres.push(genreId);
      }
    },
    resetUpdatedSeriesValues: (state) => {
      state.updateSeries = { ...initialState.updateSeries };
    },
    setSeasonTitleSearch: (state, action: PayloadAction<string>) => {
      state.addNewSeason.titleSearch = action.payload;
    },
    setNewSeasonSeriesId: (state, action: PayloadAction<IGeneralSeriesRes>) => {
      state.addNewSeason.newSeason.series_id = action.payload.series.id;
      state.addNewSeason.newEpisode.season = action.payload.series.seasons + 1;
    },
    setSeasonEpisodeTitle: (state, action: PayloadAction<string>) => {
      state.addNewSeason.newEpisode.title = action.payload;
    },
    setSeasonEpisodeSeason: (state, action: PayloadAction<number>) => {
      state.addNewSeason.newEpisode.season = action.payload;
    },
    setSeasonEpisodeEpisodeNum: (state, action: PayloadAction<number>) => {
      state.addNewSeason.newEpisode.episode_num = action.payload;
    },
    setSeasonEpisodeDuration: (state, action: PayloadAction<number>) => {
      state.addNewSeason.newEpisode.duration = action.payload;
    },
    setSeasonEpisodeEnSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewSeason.newEpisode.en_subtitles = action.payload;
    },
    setSeasonEpisodeBgSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewSeason.newEpisode.bg_subtitles = action.payload;
    },
    addSeasonEpisodePayload: (state) => {
      state.addNewSeason.newSeason.episodes.push(state.addNewSeason.newEpisode);
      state.addNewSeason.newEpisode = {
        ...initialState.addNewSeason.newEpisode,
        season: state.addNewSeason.newSeason.episodes[0].season,
      };
    },
    removeSeasonEpisodePayload: (state, action: PayloadAction<number>) => {
      state.addNewSeason.newSeason.episodes =
        state.addNewSeason.newSeason.episodes.filter(
          (ep) =>
            ep.title !==
            state.addNewSeason.newSeason.episodes[action.payload].title
        );
    },
    resetNewSeasonValues: (state) => {
      state.addNewSeason = { ...initialState.addNewSeason };
    },
    setNewEpisodesTitleSearch: (state, action: PayloadAction<string>) => {
      state.addNewEpisodes.titleSearch = action.payload;
    },
    setNewEpisodesSeriesId: (
      state,
      action: PayloadAction<IGeneralSeriesRes>
    ) => {
      state.addNewEpisodes.series_id = action.payload.series.id;
      state.addNewEpisodes.newEpisode.season = action.payload.series.seasons;
    },
    setNewEpisodesTitle: (state, action: PayloadAction<string>) => {
      state.addNewEpisodes.newEpisode.title = action.payload;
    },
    setNewEpisodesSeason: (state, action: PayloadAction<number>) => {
      state.addNewEpisodes.newEpisode.season = action.payload;
    },
    setNewEpisodesEpisodeNum: (state, action: PayloadAction<number>) => {
      state.addNewEpisodes.newEpisode.episode_num = action.payload;
    },
    setNewEpisodesDuration: (state, action: PayloadAction<number>) => {
      state.addNewEpisodes.newEpisode.duration = action.payload;
    },
    setNewEpisodesEnSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewEpisodes.newEpisode.en_subtitles = action.payload;
    },
    setNewEpisodesBgSubtitles: (state, action: PayloadAction<boolean>) => {
      state.addNewEpisodes.newEpisode.bg_subtitles = action.payload;
    },
    addNewEpisodesPayload: (state) => {
      state.addNewEpisodes.episodes.push(state.addNewEpisodes.newEpisode);
      state.addNewEpisodes.newEpisode = {
        ...initialState.addNewEpisodes.newEpisode,
        season: state.addNewEpisodes.episodes[0].season,
      };
    },
    removeNewEpisodesPayload: (state, action: PayloadAction<number>) => {
      state.addNewEpisodes.episodes = state.addNewEpisodes.episodes.filter(
        (ep) => ep.title !== state.addNewEpisodes.episodes[action.payload].title
      );
    },
    resetNewEpisodesValues: (state) => {
      state.addNewEpisodes = { ...initialState.addNewEpisodes };
    },
    setSeriesDeletedTitleSearch: (state, action: PayloadAction<string>) => {
      state.deleteSeries.titleSearch = action.payload;
    },
    setDeleteSeriesData: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        description: string;
        seasons: number;
        release_date: string;
      }>
    ) => {
      state.deleteSeries.seriesData = {
        id: action.payload.id,
        title: action.payload.title,
        description: action.payload.description,
        seasons: action.payload.seasons,
        release_date: action.payload.release_date,
      };
    },
    resetDeletedSeriesValues: (state) => {
      state.deleteSeries = { ...initialState.deleteSeries };
    },
    setSeasonDeletedTitleSearch: (state, action: PayloadAction<string>) => {
      state.deleteSeason.titleSearch = action.payload;
    },
    setDeletedSeason: (state, action: PayloadAction<number>) => {
      state.deleteSeason.season = action.payload;
    },
    setDeleteSeasonData: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        description: string;
        seasons: number;
        release_date: string;
      }>
    ) => {
      state.deleteSeason.seriesData = {
        id: action.payload.id,
        title: action.payload.title,
        description: action.payload.description,
        seasons: action.payload.seasons,
        release_date: action.payload.release_date,
      };
    },
    resetDeletedSeasonValues: (state) => {
      state.deleteSeason = { ...initialState.deleteSeason };
    },
  },
});

export const {
  setNewSeriesTitle,
  setNewSeriesDescription,
  setNewSeriesSeasons,
  setNewSeriesReleaseDate,
  setNewSeriesGenre,
  setNewEpisodeTitle,
  setNewEpisodeSeason,
  setNewEpisodeEpisodeNum,
  setNewEpisodeDuration,
  setNewEpisodeEnSubtitles,
  setNewEpisodeBgSubtitles,
  addToEpisodePayload,
  removeFromEpisodePayload,
  resetNewSeriesData,
  setFetchedUpdatedSeriesData,
  setUpdatedTitleSearch,
  setUpdatedSeriesTitle,
  setUpdatedSeriesDescription,
  setUpdatedSeriesSeasons,
  setUpdatedSeriesReleaseDate,
  setUpdatedSeriesGenre,
  resetUpdatedSeriesValues,
  setSeasonEpisodeBgSubtitles,
  setSeasonEpisodeDuration,
  setSeasonEpisodeEnSubtitles,
  setSeasonEpisodeEpisodeNum,
  setSeasonEpisodeSeason,
  setSeasonEpisodeTitle,
  setSeasonTitleSearch,
  addSeasonEpisodePayload,
  removeSeasonEpisodePayload,
  setNewSeasonSeriesId,
  resetNewSeasonValues,
  addNewEpisodesPayload,
  setNewEpisodesBgSubtitles,
  setNewEpisodesDuration,
  setNewEpisodesEnSubtitles,
  setNewEpisodesEpisodeNum,
  setNewEpisodesSeason,
  setNewEpisodesSeriesId,
  setNewEpisodesTitle,
  setNewEpisodesTitleSearch,
  resetNewEpisodesValues,
  removeNewEpisodesPayload,
  setDeleteSeriesData,
  resetDeletedSeriesValues,
  setSeriesDeletedTitleSearch,
  setDeleteSeasonData,
  setDeletedSeason,
  resetDeletedSeasonValues,
  setSeasonDeletedTitleSearch,
} = seriesManagerSlice.actions;

export default seriesManagerSlice.reducer;
