// src/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ✅ LocalStorage se token read karte waqt null safety
let tokenFromStorage = null;
try {
  const storedToken = localStorage.getItem('token');
  if (storedToken && storedToken !== 'undefined') {
    tokenFromStorage = storedToken;
  }
} catch (error) {
  console.error("Error reading token from localStorage:", error);
}

const userSlice = createSlice({
  name: 'user',
  initialState: { token: tokenFromStorage },
  reducers: {
    setToken: (state, action) => {
      const token = action.payload || null;
      console.log("Setting token:", token);
      state.token = token;

      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, clearToken } = userSlice.actions;
export default userSlice.reducer;
