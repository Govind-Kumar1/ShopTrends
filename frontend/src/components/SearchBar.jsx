import React from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Import Redux hooks
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Import Redux actions
import { setSearch, setShowSearch } from "../slices/features/uiSlice";

// ✅ Assets
import search_icon from "../assets/search_icon.png";

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get state from the Redux store
  const { search, showSearch } = useSelector((state) => state.ui);
  const { list: products } = useSelector((state) => state.products);

  // 🧠 When user types & presses Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmedSearch = search.trim().toLowerCase();

      if (trimmedSearch === "") {
        toast.warn("Please enter something to search.");
        return;
      }

      const matched = products.filter((item) =>
        item.name.toLowerCase().includes(trimmedSearch)
      );

      if (matched.length === 0) {
        toast.error("No matching products found.");
      }

      dispatch(setShowSearch(false)); // ✅ Dispatch action to close search overlay
      navigate("/product/list");      // Go to collection page to show results
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
            onChange={(e) => dispatch(setSearch(e.target.value))} // ✅ Dispatch action on change
            onKeyDown={handleKeyDown}
            placeholder="Search for products..."
            className="flex-1 p-2 border border-gray-300 rounded text-sm outline-none"
            autoFocus
          />
        </div>

        <button
          onClick={() => dispatch(setShowSearch(false))} // ✅ Dispatch action to close
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-black"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default SearchBar;