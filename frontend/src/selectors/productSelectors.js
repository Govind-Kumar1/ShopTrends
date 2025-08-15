import { createSelector } from '@reduxjs/toolkit';

// Basic selectors to get the data we need
const selectProducts = (state) => state.products.list;
const selectSearch = (state) => state.ui.search;
const selectFilters = (state) => state.filters;

// The main selector that computes the final list of products
export const selectFilteredProducts = createSelector(
  [selectProducts, selectSearch, selectFilters],
  (products, search, filters) => {
    let filtered = [...products];

    // 1. Apply Search Filter
    if (search.trim() !== '') {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));
    }

    // 2. Apply Category Filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((p) => filters.category.includes(p.category));
    }

    // 3. Apply Sub-Category Filter
    if (filters.subCategory.length > 0) {
      filtered = filtered.filter((p) => filters.subCategory.includes(p.subCategory));
    }

    // 4. Apply Sorting
    switch (filters.sort) {
      case 'low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // 'relevant' or any other case doesn't require sorting
        break;
    }

    return filtered;
  }
);