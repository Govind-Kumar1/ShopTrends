import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ API URL from env
const API = import.meta.env.VITE_API_URL;

// THUNK: Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, thunkAPI) => {
    try {
      console.log("Fetching product ID:", productId);
      const response = await fetch(`${API}/api/product/${productId}`);

      if (!response.ok) {
        throw new Error(`Product not found or server error: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Full product data:", data);

      // Return the actual product object
      return data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// THUNK: Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API}/api/product/list`);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    currentProduct: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts cases
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetchProductById cases
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload; // ✅ Sirf product object store ho raha hai
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
