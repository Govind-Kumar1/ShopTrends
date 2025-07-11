import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import search_icon from "../assets/search_icon.png";
import cross_icon from "../assets/cross_icon.png"; // Add a close icon in your assets

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

  if (!showSearch) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-60 flex items-start justify-center pt-32 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl relative">
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <img src={search_icon} alt="Search" className="w-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 p-2 border border-gray-300 rounded text-sm outline-none"
            autoFocus
          />
        </div>

        {/* Close Button */}
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
