import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitOperationHistory } from "../client/data/InitOperationHistory";

const HistorySlice = createSlice({
  name: "history",
  initialState: {
    total: "",
    operations: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.total;
        state.operations = action.payload.operations;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async () => await InitOperationHistory()
);

export default HistorySlice.reducer;
