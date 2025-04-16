import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  notification: {
    emoji: "",
    statusCode: 0,
    message: "",
  },
  devOptions: {
    visibility: false,
  },
};

const uiManager = createSlice({
  name: "cosmetics",
  initialState,
  reducers: {
    popUpNotification: (
      state,
      action: PayloadAction<{
        emoji: string;
        statusCode: number;
        message: string;
      }>
    ) => {
      state.notification = { ...action.payload };
    },
    changeDevVisibility: (state, action: PayloadAction<boolean>) => {
      state.devOptions.visibility = action.payload;
    },
  },
});

export const { popUpNotification, changeDevVisibility } = uiManager.actions;
export default uiManager.reducer;
