import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import dropdown_icon from '../assets/dropdown_icon.png';
import SearchBar from "../components/SearchBar";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
  let productsCopy = [...products];

  // 🔍 Search filter (Always apply if search is not empty)
  if (search.trim() !== "") {
    productsCopy = productsCopy.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // ✅ Category filter
  if (category.length > 0) {
    productsCopy = productsCopy.filter((item) =>
      category.includes(item.category)
    );
  }

  // ✅ Sub-category filter
  if (subCategory.length > 0) {
    productsCopy = productsCopy.filter((item) =>
      subCategory.includes(item.subCategory)
    );
  }

  setFilterProducts(productsCopy);
};


  const sortProduct = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case "low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        return;
    }

    setFilterProducts(sorted);
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
  };

  useEffect(() => {
    applyFilter();
  }, [products, search, showSearch, category, subCategory]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <>
      {/* ✅ Search Bar at Top */}
      <SearchBar />

      <div className="flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10">
        {/* Filters */}
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 my-2 text-xl cursor-pointer"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
              src={dropdown_icon}
              alt="Dropdown"
            />
          </p>

          {/* Category Filters */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["Men", "Women", "Kids"].map((cat) => (
                <label key={cat} className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3"
                    value={cat}
                    onChange={toggleCategory}
                    checked={category.includes(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* SubCategory Filters */}
          <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium">TYPES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                <label key={sub} className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3"
                    value={sub}
                    onChange={toggleSubCategory}
                    checked={subCategory.includes(sub)}
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className={`px-4 py-2 mt-1 text-white bg-black rounded hover:bg-gray-900 ${showFilter ? "block" : "hidden"} sm:block`}
          >
            Clear Filters
          </button>
        </div>

        {/* Products List */}
        <div className="flex-1">
          <div className="flex justify-between mb-4 text-base sm:text-2xl">
            <Title text1="ALL" text2="COLLECTIONS" />
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="px-2 text-sm border-2 border-gray-300"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Render Filtered Products */}
          {filterProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
              {filterProducts.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Collection;
