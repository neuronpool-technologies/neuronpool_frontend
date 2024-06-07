import { createSlice } from "@reduxjs/toolkit";

const HistorySlice = createSlice({
  name: "history",
  initialState: {
    total: "",
    operations: [],
  },
  reducers: {
    setHistory: (state, action) => {
      state.total = action.payload.total;
      state.operations = action.payload.operations;
    },
  },
});

export const { setHistory } = HistorySlice.actions;

export default HistorySlice.reducer;
