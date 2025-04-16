import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IStream } from "../utility/interfaces/redux-store";

const initialState: IStream = {
  resumeTime: 0,
  activeId: undefined,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setResumeTime: (state, action: PayloadAction<IStream>) => {
      state.resumeTime = action.payload.resumeTime;
      state.activeId = action.payload.activeId;
    },
  },
});

export const { setResumeTime } = streamSlice.actions;
export default streamSlice.reducer;
