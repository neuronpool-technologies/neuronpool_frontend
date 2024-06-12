import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  principal: "",
  icp_address: "",
  icp_balance: "",
  neuronpool_balance: "",
  neuronpool_withdrawal_neurons: [],
  claimed_prize_neurons: [],
  all_prize_neurons: [],
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
    setWallet: (state, action) => {
      state.icp_address = action.payload.icp_address;
      state.icp_balance = action.payload.icp_balance;
      state.neuronpool_balance = action.payload.neuronpool_balance;
      state.neuronpool_withdrawal_neurons =
        action.payload.neuronpool_withdrawal_neurons;
      state.claimed_prize_neurons = action.payload.claimed_prize_neurons;
      state.all_prize_neurons = action.payload.all_prize_neurons;
    },
  },
});

export const { setLogin, setLogout, setPrincipal, setWallet } =
  LoginSlice.actions;

export default LoginSlice.reducer;
