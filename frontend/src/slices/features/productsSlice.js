import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ YEH LINE ADD KARNI HAI
const API = import.meta.env.VITE_API_URL;
//console.log("API URL:", API); // ✅ YEH CONSOLE LOG ADD KAREIN
// THUNK TO FETCH A SINGLE PRODUCT BY ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, thunkAPI) => {
    try {
      console.log("Fetching product ID:", productId); // Debug
      const response = await fetch(`${API}/api/product/${productId}`);
      
      if (!response.ok) {
        throw new Error(`Product not found or server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Full product data:", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// THUNK TO FETCH ALL PRODUCTS
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
      // Cases for fetchProducts
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
      // Cases for fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;