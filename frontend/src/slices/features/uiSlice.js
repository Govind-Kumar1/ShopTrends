// src/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { search: '', showSearch: false },
  reducers: {
    setSearch:    (state, action) => { state.search = action.payload; },
    setShowSearch: (state, action) => { state.showSearch = action.payload; },
  },
});

export const { setSearch, setShowSearch } = uiSlice.actions;
export default uiSlice.reducer;
