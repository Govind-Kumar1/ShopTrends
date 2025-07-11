import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate, useLocation } from "react-router-dom";
import search_icon from "../assets/search_icon.png";
import { toast } from "react-toastify";

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    products,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  // 🧠 When user types & presses Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const matched = products.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );

      if (search.trim() === "") {
        toast.warn("Please enter something to search.");
        return;
      }

      if (matched.length === 0) {
        toast.error("No matching products found.");
      }

      setShowSearch(false);       // close search overlay
      navigate("/product/list");  // go to collection page
    }
  };

  if (!showSearch) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-60 flex items-start justify-center pt-32 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl relative">
        <div className="flex items-center gap-2">
          <img src={search_icon} alt="Search" className="w-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products..."
            className="flex-1 p-2 border border-gray-300 rounded text-sm outline-none"
            autoFocus
          />
        </div>

        <button
          onClick={() => setShowSearch(false)}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-black"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
