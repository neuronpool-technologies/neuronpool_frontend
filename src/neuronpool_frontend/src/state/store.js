import { configureStore } from "@reduxjs/toolkit";
import Profile from "./ProfileSlice";
import Protocol from "./ProtocolSlice";
import History from "./HistorySlice";
import Neuron from "./NeuronSlice";
import Withdrawals from "./WithdrawalsSlice";

const store = configureStore({
  reducer: { Profile, Protocol, History, Neuron, Withdrawals },
});

export default store;
