// src/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem('token') || null;
const userSlice = createSlice({
  name: 'user',
  initialState: { token: tokenFromStorage },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, clearToken } = userSlice.actions;
export default userSlice.reducer;
