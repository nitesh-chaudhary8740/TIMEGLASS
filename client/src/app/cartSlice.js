/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

// Robust localStorage loader
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('tg_cart');
    if (!savedCart) return { items: [], totalQuantity: 0, totalAmount: 0 };
    return JSON.parse(savedCart);
  } catch (err) {
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

const initialState = loadCart();

// Helper to ensure math is always accurate
const updateTotals = (state) => {
  state.totalQuantity = state.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  state.totalAmount = state.items.reduce((acc, item) => {
    const price = item.price || 0;
    const qty = item.quantity || 0;
    return acc + (price * qty);
  }, 0);
  localStorage.setItem('tg_cart', JSON.stringify(state));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      if (!product) return;

      const existing = state.items.find(i => i._id === product._id);
      if (!existing) {
        state.items.push({ ...product, quantity: 1 });
      } else {
        existing.quantity++;
      }
      
      updateTotals(state);
    },

    removeFromCart: (state, action) => {
      // Handle both string ID and object payload
      const id = typeof action.payload === 'string' ? action.payload : action.payload?.id;
      const deleteAll = action.payload?.deleteAll || false;

      const itemIndex = state.items.findIndex(i => i._id === id);
      
      if (itemIndex > -1) {
        if (deleteAll || state.items[itemIndex].quantity <= 1) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity--;
        }
      }
      
      updateTotals(state);
    },

// src/app/cartSlice.js

syncWithDB: (state, action) => {
  const dbCart = action.payload || []; 
  
  state.items = dbCart.map(i => {
    // If the product field is an object (populated)
    if (i.product && typeof i.product === 'object') {
      return {
        ...i.product,
        quantity: i.quantity,
        _id: i.product._id
      };
    }
    // If it's just an ID (not populated yet)
    return {
      _id: i.product || i._id,
      quantity: i.quantity,
      price: i.price || 0 // Fallback
    };
  });

  updateTotals(state);
},

  // src/app/cartSlice.js

clearCart: (state) => {
  // Clear localStorage first
  localStorage.removeItem('tg_cart');
  
  // Explicitly reset state to ensure reactivity
  state.items = [];
  state.totalQuantity = 0;
  state.totalAmount = 0;
},
  }
});

export const { addToCart, removeFromCart, syncWithDB, clearCart } = cartSlice.actions;
export default cartSlice.reducer;