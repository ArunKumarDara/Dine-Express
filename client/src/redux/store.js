import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";
import loaderReducer from "./loaderSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    loader: loaderReducer,
  },
});

export default store;
