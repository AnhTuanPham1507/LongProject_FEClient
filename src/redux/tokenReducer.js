import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
    clear: (state,action) => {
      state.value = null
    },
  },
});

// Action creators are generated for each case reducer function
export const { setValue, clear} = tokenSlice.actions;

export default tokenSlice.reducer;
