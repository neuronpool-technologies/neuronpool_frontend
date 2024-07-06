import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitProtocolInfo } from "../client/data/InitProtocolInfo";

const ProtocolSlice = createSlice({
  name: "protocol",
  initialState: {
    account_identifier: "",
    icrc_identifier: "",
    minimum_stake: "",
    minimum_withdrawal: "",
    protocol_fee_percentage: "",
    reward_timer_duration_nanos: "",
    default_neuron_followee: "",
    main_neuron_id: "",
    main_neuron_dissolve_seconds: "",
    total_protocol_fees: "",
    total_stake_amount: "",
    total_stakers: "",
    icp_price_usd: "",
    apr_estimate: "",
    apr_e8s: "",
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProtocolInformation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProtocolInformation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.account_identifier = action.payload.account_identifier;
        state.icrc_identifier = action.payload.icrc_identifier;
        state.minimum_stake = action.payload.minimum_stake;
        state.minimum_withdrawal = action.payload.minimum_withdrawal;
        state.protocol_fee_percentage = action.payload.protocol_fee_percentage;
        state.reward_timer_duration_nanos =
          action.payload.reward_timer_duration_nanos;
        state.default_neuron_followee = action.payload.default_neuron_followee;
        state.main_neuron_id = action.payload.main_neuron_id;
        state.main_neuron_dissolve_seconds =
          action.payload.main_neuron_dissolve_seconds;
        state.total_protocol_fees = action.payload.total_protocol_fees;
        state.total_stake_amount = action.payload.total_stake_amount;
        state.total_stakers = action.payload.total_stakers;
        state.icp_price_usd = action.payload.icp_price_usd;
        state.apr_estimate = action.payload.apr_estimate;
        state.apr_e8s = action.payload.apr_e8s;
      })
      .addCase(fetchProtocolInformation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchProtocolInformation = createAsyncThunk(
  "protocol/fetchProtocolInformation",
  async () => await InitProtocolInfo()
);

export default ProtocolSlice.reducer;
