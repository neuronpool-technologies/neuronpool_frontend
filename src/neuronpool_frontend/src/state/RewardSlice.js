import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitRewardNeurons } from "../client/data/InitRewardNeurons";

const initialState = {
  unclaimed_prize_neurons_ids: [],
  claimed_prize_neurons_ids: [],
  unclaimed_prize_neurons_information: [],
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
        state.claimed_prize_neurons_ids =
          action.payload.claimed_prize_neurons_ids;
        state.unclaimed_prize_neurons_ids =
          action.payload.unclaimed_prize_neurons_ids;
        state.unclaimed_prize_neurons_information =
          action.payload.unclaimed_prize_neurons_information;
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
