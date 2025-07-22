import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(null); // ✅ Added token state
  const navigate = useNavigate();

  const currency = "$";
  const delivery_fee = 10;

  const API = import.meta.env.VITE_API_URL;

  // ✅ Fetch products on mount
  useEffect(() => {
    if (!API) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/product/list`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [API]);

  // ✅ Load token & cart from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }

    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // ✅ Sync cart to backend
  const syncCartToBackend = async (cartData) => {
    if (!token || !API) return;

    try {
      await fetch(`${API}/api/user/addItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartData }),
      });
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  };

  // ✅ Add to Cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select a Size");
      return;
    } else {
      toast.success("Item Added To The Cart");
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
    localStorage.setItem("cartItems", JSON.stringify(cartData));
    await syncCartToBackend(cartData);
  };

  // ✅ Update Quantity
  const updateQuantity = async (itemId, size, quantity) => {
    if (quantity === 0) {
      toast.success("Item Removed From The Cart");
    }

    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;

    setCartItems(cartData);
    localStorage.setItem("cartItems", JSON.stringify(cartData));
    await syncCartToBackend(cartData);
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    await syncCartToBackend({});
  };

  // ✅ Get Cart Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  // ✅ Get Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        }
      }
    }
    return totalAmount;
  };

  // ✅ Context Values
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartAmount,
    token,        // ✅ Exported
    setToken,     // ✅ Exported
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
