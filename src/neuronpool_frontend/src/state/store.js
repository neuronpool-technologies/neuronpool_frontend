import { configureStore } from "@reduxjs/toolkit";
import Profile from "./ProfileSlice";
import Protocol from "./ProtocolSlice";
import History from "./HistorySlice";

const store = configureStore({
  reducer: { Profile, Protocol, History },
});

export default store;
