import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InitWallet } from "../client/data/InitWallet";

const initialState = {
  logged_in: false,
  principal: "",
  icp_address: "",
  icp_balance: "",
  neuronpool_balance: "",
  status: "idle",
  error: null,
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLogin: (state) => {
      state.logged_in = true;
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
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setLogin, setLogout, setPrincipal } = ProfileSlice.actions;

export const fetchWallet = createAsyncThunk(
  "profile/fetchWallet",
  async ({ principal }) => await InitWallet({ principal })
);

export default ProfileSlice.reducer;
