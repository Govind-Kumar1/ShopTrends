import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Import Redux actions and the new selector
import { toggleCategory, toggleSubCategory, setSort, clearFilters } from '../slices/features/filterSlice';
import { selectFilteredProducts } from '../selectors/productSelectors';

// Import Components and Assets
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import dropdown_icon from '../assets/dropdown_icon.png';

const Collection = () => {
  const dispatch = useDispatch();

  const [showFilter, setShowFilter] = useState(false);

  // ✅ Get the final list of products with just one line!
  const filteredProducts = useSelector(selectFilteredProducts); 
  
  // ✅ Get the current filter state to manage the UI (e.g., checked checkboxes)
  const { category, subCategory } = useSelector((state) => state.filters);

  return (
    <>
      {/* SearchBar is already in App.jsx, so it can be removed if duplicated */}
      <div className="flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10">
        {/* Filters */}
        <div className="min-w-60">
          <p onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 my-2 text-xl cursor-pointer">
            FILTERS
            <img className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} src={dropdown_icon} alt="Dropdown" />
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
                    onChange={() => dispatch(toggleCategory(cat))}
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
                    onChange={() => dispatch(toggleSubCategory(sub))}
                    checked={subCategory.includes(sub)}
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>

          <button onClick={() => dispatch(clearFilters())} className={`px-4 py-2 mt-1 text-white bg-black rounded hover:bg-gray-900 ${showFilter ? "block" : "hidden"} sm:block`}>
            Clear Filters
          </button>
        </div>

        {/* Products List */}
        <div className="flex-1">
          <div className="flex justify-between mb-4 text-base sm:text-2xl">
            <Title text1="ALL" text2="COLLECTIONS" />
            <select onChange={(e) => dispatch(setSort(e.target.value))} className="px-2 text-sm border-2 border-gray-300">
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Render Filtered Products */}
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
              {filteredProducts.map((item) => (
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