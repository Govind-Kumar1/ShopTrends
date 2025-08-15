import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: [],
  subCategory: [],
  sort: 'relevant', // 'relevant', 'low-high', 'high-low'
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleCategory: (state, action) => {
      const category = action.payload;
      if (state.category.includes(category)) {
        state.category = state.category.filter((c) => c !== category);
      } else {
        state.category.push(category);
      }
    },
    toggleSubCategory: (state, action) => {
      const subCategory = action.payload;
      if (state.subCategory.includes(subCategory)) {
        state.subCategory = state.subCategory.filter((sc) => sc !== subCategory);
      } else {
        state.subCategory.push(subCategory);
      }
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    clearFilters: (state) => {
      state.category = [];
      state.subCategory = [];
      state.sort = 'relevant';
    },
  },
});

export const { toggleCategory, toggleSubCategory, setSort, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;