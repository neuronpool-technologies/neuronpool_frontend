import { createSlice } from "@reduxjs/toolkit";

const LoginSlice = createSlice({
  name: "login",
  initialState: {
    loggedIn: false,
    principal: "",
    icp_address: "",
    icp_balance: "",
  },
  reducers: {
    setLogin: (state) => {
      state.loggedIn = true;
    },
    setLogout: (state) => {
      state.loggedIn = false;
    },
    setPrincipal: (state, action) => {
      state.principal = action.payload;
    },
    setWallet: (state, action) => {
      state.icp_address = action.payload.icp_address;
      state.icp_balance = action.payload.icp_balance;
    },
  },
});

export const { setLogin, setLogout, setPrincipal, setWallet } = LoginSlice.actions;

export default LoginSlice.reducer;
