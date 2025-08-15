import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = import.meta.env.VITE_API_URL;

// --- THUNK TO FETCH USER'S ORDERS ---
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().user;
    if (!token) return rejectWithValue('No token found');
    
    try {
      const response = await fetch(`${API}/api/order/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ --- THUNK TO PLACE A NEW ORDER ---
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { getState, rejectWithValue }) => {
    const { token } = getState().user;
    if (!token) return rejectWithValue('User not authenticated');
    
    try {
      const response = await fetch(`${API}/api/order/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data; // Return the success response from the server
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetching orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // ✅ --- CASES FOR PLACING AN ORDER ---
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading'; // Show a loading state while the order is being placed
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded on successful order placement
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store any error message from the backend
      });
  }
});

export default orderSlice.reducer;