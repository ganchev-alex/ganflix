import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ICosmetics } from "../utility/interfaces/redux-store";

const initialState: ICosmetics = {
  backlights: {
    colorful: "#ffe799",
  },
};

const cosmeticsSlice = createSlice({
  name: "cosmetics",
  initialState,
  reducers: {
    setColorfulBacklight: (state, action: PayloadAction<string>) => {
      state.backlights.colorful = action.payload;
    },
  },
});

export const { setColorfulBacklight } = cosmeticsSlice.actions;
export default cosmeticsSlice.reducer;
