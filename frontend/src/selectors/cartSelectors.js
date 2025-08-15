import { createSelector } from '@reduxjs/toolkit';

// Basic selectors to get slices of the state
const selectCartItems = (state) => state.cart.items;
const selectProducts = (state) => state.products.list;

// Memoized selector for the total number of items in the cart
export const selectCartCount = createSelector(
  [selectCartItems],
  (cartItems) => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) { 
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  }
);

// Memoized selector for the total monetary amount of the cart
export const selectCartTotalAmount = createSelector(
  [selectCartItems, selectProducts],
  (cartItems, products) => {
    let totalAmount = 0;
    if (products.length === 0) return 0; // Return early if products aren't loaded

    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        for (const size in cartItems[itemId]) {
          const quantity = cartItems[itemId][size];
          totalAmount += product.price * quantity;
        }
      }
    }
    return totalAmount;
  }
);

// ✅ ADD THIS NEW SELECTOR
// This selector creates a detailed list of items in the cart with their full product info
export const selectCartDetails = createSelector(
  [selectCartItems, selectProducts],
  (cartItems, products) => {
    const detailedCart = [];
    if (products.length === 0) return detailedCart; // Return empty if products aren't loaded

    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        for (const size in cartItems[itemId]) {
          detailedCart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image[0], // We only need the first image for the cart view
            size: size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }
    return detailedCart;
  }
);