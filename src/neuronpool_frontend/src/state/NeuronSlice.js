import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitMainNeuronInfo } from "../client/data/InitMainNeuronInfo";

const NeuronSlice = createSlice({
  name: "neuron",
  initialState: {
    maturity_e8s_equivalent: "",
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNeuron.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNeuron.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maturity_e8s_equivalent = action.payload.maturity_e8s_equivalent;
      })
      .addCase(fetchNeuron.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchNeuron = createAsyncThunk(
  "neuron/fetchNeuron",
  async () => await InitMainNeuronInfo()
);

export default NeuronSlice.reducer;
