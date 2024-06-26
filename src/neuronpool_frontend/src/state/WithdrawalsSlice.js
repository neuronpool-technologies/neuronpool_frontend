import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitWithdrawalNeurons } from "../client/data/InitWithdrawalNeurons";

const initialState = {
  neuronpool_withdrawal_neurons_information: [],
  neuronpool_withdrawal_neurons_ids: [],
  status: "idle",
  error: null,
};

const WithdrawalsSlice = createSlice({
  name: "withdrawals",
  initialState,
  reducers: {
    clearWithdrawals: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.neuronpool_withdrawal_neurons_information = action.payload.neuronpool_withdrawal_neurons_information;
        state.neuronpool_withdrawal_neurons_ids = action.payload.neuronpool_withdrawal_neurons_ids;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearWithdrawals } = WithdrawalsSlice.actions;

export const fetchWithdrawals = createAsyncThunk(
  "withdrawals/fetchWithdrawals",
  async () =>
    await InitWithdrawalNeurons()
);

export default WithdrawalsSlice.reducer;
