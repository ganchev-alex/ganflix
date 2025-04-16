import { configureStore } from "@reduxjs/toolkit";

import movieManagerReducer from "./movie-manager";
import seriesManagerReducer from "./series-manager";
import exploreManagerReducer from "./explore";
import cosmeticsReducer from "./cosmetics";
import uiReducer from "./ui";
import streamReducer from "./stream";
import catalogueReducer from "./catalogues";

const store = configureStore({
  reducer: {
    comsetics: cosmeticsReducer,
    movieManager: movieManagerReducer,
    seriesManager: seriesManagerReducer,
    exploreManager: exploreManagerReducer,
    ui: uiReducer,
    stream: streamReducer,
    catalogue: catalogueReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
