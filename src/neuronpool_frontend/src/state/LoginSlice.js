import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitWallet } from "../client/data/InitWallet";

const initialState = {
  loggedIn: false,
  principal: "",
  icp_address: "",
  icp_balance: "",
  neuronpool_balance: "",
  neuronpool_withdrawal_neurons: [],
  claimed_prize_neurons: [],
  all_prize_neurons: [],
  status: "idle",
  error: null,
};

const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state) => {
      state.loggedIn = true;
    },
    setLogout: () => initialState,
    setPrincipal: (state, action) => {
      state.principal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.icp_address = action.payload.icp_address;
        state.icp_balance = action.payload.icp_balance;
        state.neuronpool_balance = action.payload.neuronpool_balance;
        state.neuronpool_withdrawal_neurons =
          action.payload.neuronpool_withdrawal_neurons;
        state.claimed_prize_neurons = action.payload.claimed_prize_neurons;
        state.all_prize_neurons = action.payload.all_prize_neurons;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setLogin, setLogout, setPrincipal } = LoginSlice.actions;

export const fetchWallet = createAsyncThunk(
  "login/fetchWallet",
  async ({ principal }) => await InitWallet({ principal })
);

export default LoginSlice.reducer;
