import { configureStore } from "@reduxjs/toolkit";
import Profile from "./ProfileSlice";
import Protocol from "./ProtocolSlice";
import History from "./HistorySlice";
import Neuron from "./NeuronSlice";

const store = configureStore({
  reducer: { Profile, Protocol, History, Neuron },
});

export default store;
