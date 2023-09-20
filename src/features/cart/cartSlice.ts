import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICart, IPizza } from "../../types";
import { RootState } from "../../store";

type CartSlice = {
  cart: ICart[];
};

const initialState: CartSlice = {
  cart: [],
};

export const cartSLice = createSlice({
  name: "cart",
  initialState: initialState,

  reducers: {
    addItem: (state, action: PayloadAction<ICart>) => {
      state.cart.push(action.payload);
    },
    deleteItem: (state, action: PayloadAction<ICart["pizzaId"]>) => {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity: (state, action: PayloadAction<ICart["pizzaId"]>) => {
      const cartItem = state.cart.find(
        (item) => item.pizzaId === action.payload
      );

      if (!cartItem) return;

      cartItem.quantity++;
      cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;
    },
    decreaseItemQuantity: (state, action: PayloadAction<ICart["pizzaId"]>) => {
      const cartItem = state.cart.find(
        (item) => item.pizzaId === action.payload
      );

      if (!cartItem) return;

      cartItem.quantity--;
      cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSLice.actions;
export default cartSLice.reducer;

export const getCart = (state: RootState) => state.cart.cart;

export const getTotalCartPrice = (state: RootState) =>
  state.cart.cart.reduce((acc, val) => acc + val.totalPrice, 0);
export const getTotalCartQuantity = (state: RootState) =>
  state.cart.cart.reduce((acc, val) => acc + val.quantity, 0);

export const getCurrentQuantityById = (id: number) => (state: RootState) => {
  return state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
};
