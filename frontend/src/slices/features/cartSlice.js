import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearToken } from './userSlice'; // ✅ YEH LINE ADD KARNI HAI

const API = import.meta.env.VITE_API_URL;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, dispatch }) => {
    const { token } = getState().user;

    if (token) {
      try {
        const response = await fetch(`${API}/api/user/get-cart`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });

        if (response.status === 401) {
          // Ab yeh line kaam karegi kyunki clearToken imported hai
          dispatch(clearToken());
          throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        return data.cartData || {};
      } catch (error) {
        // Error message ko console mein dikhayega
        console.error('Failed to fetch cart:', error.message);
        return {};
      }
    }
    return {};
  }
);

// Load initial state from localStorage only once, when the slice is created
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
    },
    clearCart: (state) => {
      state.items = {};
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addToCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;