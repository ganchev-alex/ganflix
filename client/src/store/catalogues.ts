import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICatalogues } from "../utility/interfaces/redux-store";

const initialState: ICatalogues = {
  catalogueKind: "listings",
  catalogueId: "",
};

const catalogueSlice = createSlice({
  name: "catalogues",
  initialState,
  reducers: {
    setCatalogue: (state, action: PayloadAction<ICatalogues>) => {
      state.catalogueKind = action.payload.catalogueKind;
      state.catalogueId = action.payload.catalogueId;
    },
  },
});

export const { setCatalogue } = catalogueSlice.actions;
export default catalogueSlice.reducer;
