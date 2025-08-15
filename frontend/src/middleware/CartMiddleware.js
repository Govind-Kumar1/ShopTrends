// src/middleware/cartMiddleware.js

const API = import.meta.env.VITE_API_URL;

// Function to sync the cart with the backend
const syncCartToBackend = async (cartData, token) => {
  if (!token || !API) return;

  try {
    await fetch(`${API}/api/user/addItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cartData }), // Ensure your backend expects this structure
    });
  } catch (error) {
    console.error("Failed to sync cart:", error);
    // Optionally, dispatch an error action here
  }
};


export const cartMiddleware = (store) => (next) => (action) => {
  // Let the action pass through to the reducer first
  const result = next(action);

  // Check if the action is one of the cart actions we care about
  const cartActions = [
    "cart/addToCart",
    "cart/updateQuantity",
    "cart/clearCart",
  ];

  if (cartActions.includes(action.type)) {
    // Get the updated state
    const state = store.getState();
    const { cartItems } = state.cart;
    const { token } = state.user;

    // Perform side effects
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      // If the cart is empty, remove the item from storage
      localStorage.removeItem("cartItems");
    }

    // Sync with the backend
    syncCartToBackend(cartItems, token);
  }

  return result;
};