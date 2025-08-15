import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearToken } from './userSlice';

const API = import.meta.env.VITE_API_URL;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (token, { dispatch }) => {
    if (!token) return []; // Return an empty array if no token
    try {
      const response = await fetch(`${API}/api/user/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        dispatch(clearToken());
        throw new Error('Session expired. Please log in again.');
      }
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      return data.cartData || []; // Expect an array from backend
    } catch (error) {
      console.error('❌ Failed to fetch cart:', error.message);
      return [];
    }
  }
);

const initialCart = JSON.parse(localStorage.getItem('cartItems')) || {};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialCart,
  },
  reducers: {
    addToCart: (state, action) => {
      const { itemId, size } = action.payload;
      if (!size) return;
      const itemInCart = state.items[itemId] || {};
      const newQuantity = (itemInCart[size] || 0) + 1;
      state.items[itemId] = { ...itemInCart, [size]: newQuantity };
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { itemId, size, quantity } = action.payload;
      if (!state.items[itemId]) return;
      if (quantity <= 0) {
        delete state.items[itemId][size];
        if (Object.keys(state.items[itemId]).length === 0) {
          delete state.items[itemId];
        }
      } else {
        state.items[itemId][size] = quantity;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = {};
      localStorage.removeItem('cartItems');
    },
    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      // ✅ TRANSFORM: Convert backend's array into frontend's object format
      const newCartObject = {};
      const backendCartArray = action.payload; // This is the array from the DB

      for (const item of backendCartArray) {
        const { productId, size, quantity } = item;
        if (!newCartObject[productId]) {
          newCartObject[productId] = {};
        }
        newCartObject[productId][size] = quantity;
      }

      state.items = newCartObject;
      localStorage.setItem('cartItems', JSON.stringify(newCartObject));
    });
  },
});

export const { addToCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;