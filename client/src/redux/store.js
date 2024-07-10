import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";
import loaderReducer from "./loaderSlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    loader: loaderReducer,
    cart: cartReducer,
  },
});

export default store;
