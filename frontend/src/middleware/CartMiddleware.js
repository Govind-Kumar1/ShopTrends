// File: src/middleware/CartMiddleware.js

const API = import.meta.env.VITE_API_URL;

const syncCartToBackend = async (cartData, token) => {
  if (!token || !API) return;
  try {
    await fetch(`${API}/api/user/update-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cartData }),
    });
    // ✅ DEBUG: Let's see if the sync function is successful
  //  console.log("Cart sync request sent to backend."); 
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
};

export const cartMiddleware = (store) => (next) => (action) => {
  // ✅ DEBUG: This will run for EVERY action you dispatch.
  //console.log("Cart Middleware received action:", action.type);

  const result = next(action);

  const cartActions = [
    "cart/addToCart",
    "cart/updateQuantity",
    "cart/clearCart",
  ];

  if (cartActions.includes(action.type)) {
    // ✅ DEBUG: This will only run if the action is a cart action.
   // console.log("Action is a cart action. Preparing to sync...");

    const state = store.getState();
    const { items } = state.cart;
    const { token } = state.user;

    if (token) {
      syncCartToBackend(items, token);
    } else {
      console.log("No token found, cannot sync cart.");
    }
  }

  return result;
};
