import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addItems: (state, action) => {
      const existingItem = state.cart.find(
        (each) => each._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItems: (state, action) => {
      const existingItem = state.cart.find(
        (each) => each._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity -= 1;
        if (existingItem.quantity === 0) {
          state.cart = state.cart.filter(
            (each) => each._id !== action.payload._id
          );
        }
      }
    },
  },
});

export const { addItems, removeItems } = cartSlice.actions;
export default cartSlice.reducer;
