// src/features/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [], 
  users: [
    { id: 1, name: "Rahul S.", email: "rahul@example.com", joined: "2025-10-01" },
    { id: 2, name: "Sanya M.", email: "sanya@timeglass.com", joined: "2025-11-15" }
  ],
  disputes: [
    { 
      id: 101, 
      user: "Rahul S.", 
      issue: "Damaged Glass", 
      status: "Open",
      details: "The sapphire crystal has a hairline fracture upon unboxing.",
      messages: [
        { sender: 'customer', text: "I received my Horizon watch today and it has a scratch.", time: "10:00 AM" }
      ]
    },
    { 
      id: 102, 
      user: "Sanya M.", 
      issue: "Wrong Color", 
      status: "Resolved",
      details: "Ordered Rose Gold, received Silver.",
      messages: [
        { sender: 'customer', text: "This isn't the color I ordered.", time: "Yesterday" },
        { sender: 'admin', text: "We apologize. We are shipping the Rose Gold variant today.", time: "Yesterday" }
      ]
    }
  ],
  stats: {
    totalSales: 125400,
    totalOrders: 42,
    activeUsers: 120
  }
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
    addProduct(state, action) {
      state.products.push(action.payload);
    },
    deleteProduct(state, action) {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    // Updated for Support Hub
    addMessageToDispute(state, action) {
      const { id, message } = action.payload;
      const dispute = state.disputes.find(d => d.id === id);
      if (dispute) {
        dispute.messages.push(message);
      }
    },
    updateDisputeStatus(state, action) {
      const { id, status } = action.payload;
      const dispute = state.disputes.find(d => d.id === id);
      if (dispute) dispute.status = status;
    },
    updateProductStatus(state, action) {
    const { id, status } = action.payload;
    const product = state.products.find(p => p.id === id);
    if (product) {
      product.status = status;
    }
  },
  }
});

export const { setProducts, addProduct, updateDisputeStatus, deleteProduct, addMessageToDispute,updateProductStatus } = adminSlice.actions;
export default adminSlice.reducer;