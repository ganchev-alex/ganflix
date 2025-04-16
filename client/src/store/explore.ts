import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExplore } from "../utility/interfaces/redux-store";

const initialState: IExplore = {
  searchValue: "",
  type: "Movies",
  filters: {
    orderBy: "Most Recently Added",
    listing: { id: "default", name: "All", icon_src: "" },
    genre: { id: "default", genre: "All" },
    year: "All",
  },
  pagination: {
    totalResults: 0,
    currentPage: 1,
    pageLimit: 30,
    totalPages: 0,
  },
};

const exploreManagerSlice = createSlice({
  name: "explore_manager",
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setMediaType: (
      state,
      action: PayloadAction<"All" | "Movies" | "Series">
    ) => {
      state.type = action.payload;
    },
    setOrderingStatement: (
      state,
      action: PayloadAction<
        | "Most Recently Added"
        | "Least Recently Added"
        | "Latest Releases"
        | "Earliest Releases"
        | "By Title A-to-Z"
        | "By Title Z-to-A"
      >
    ) => {
      state.filters.orderBy = action.payload;
    },
    setListingFilter: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      state.filters.listing = { ...action.payload, icon_src: "" };
    },
    setGenreFilter: (
      state,
      action: PayloadAction<{ id: string; genre: string }>
    ) => {
      state.filters.genre = { ...action.payload };
    },
    setYearFilter: (state, action: PayloadAction<string>) => {
      state.filters.year = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (action.payload > state.pagination.totalPages) {
        state.pagination.currentPage = state.pagination.totalPages;
      } else if (action.payload < 0) {
        state.pagination.currentPage = 1;
      } else {
        state.pagination.currentPage = action.payload;
      }
    },
    modifyCurrantPage: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.pagination.currentPage++;
      } else {
        state.pagination.currentPage--;
      }
    },
    setTotalResults: (state, action: PayloadAction<number>) => {
      state.pagination.totalResults = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pagination.pageLimit = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.pagination.totalPages = action.payload;
    },
    resetFiltering: (state) => {
      state.type = "Movies";
      state.searchValue = "";
      state.filters = { ...initialState.filters };
    },
  },
});

export const {
  setSearchValue,
  setMediaType,
  setOrderingStatement,
  setListingFilter,
  setGenreFilter,
  setYearFilter,
  setCurrentPage,
  modifyCurrantPage,
  setTotalResults,
  setPageLimit,
  setTotalPages,
  resetFiltering,
} = exploreManagerSlice.actions;
export default exploreManagerSlice.reducer;
