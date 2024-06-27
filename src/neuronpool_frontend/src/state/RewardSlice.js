import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitRewardNeurons } from "../client/data/InitRewardNeurons";

const initialState = {
  unclaimed_prize_neurons: [],
  claimed_prize_neurons: [],
  status: "idle",
  error: null,
};
const RewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    clearRewardNeurons: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardNeurons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRewardNeurons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.claimed_prize_neurons = action.payload.claimed_prize_neurons;
        state.unclaimed_prize_neurons = action.payload.unclaimed_prize_neurons;
      })
      .addCase(fetchRewardNeurons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearRewardNeurons } = RewardSlice.actions;

export const fetchRewardNeurons = createAsyncThunk(
  "reward/fetchRewardNeurons",
  async () => await InitRewardNeurons()
);

export default RewardSlice.reducer;
