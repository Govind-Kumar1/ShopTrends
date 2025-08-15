import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // ✅ Import the useSelector hook
import Title from "./Title";
import ProductItem from "./ProductItem"; 

const LatestCollection = () => {
  // ✅ Get the products list from the Redux store
  const { list: products } = useSelector((state) => state.products);
  const [latestProducts, setLatestProducts] = useState([]);
  //  console.log("inside latest collection", products);
  useEffect(() => {
    if (products.length > 0) {
      // Shuffle and pick 10 random products
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      setLatestProducts(selected);
    }
  }, [products]); // This dependency on products from Redux works perfectly

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Step into a world of style with our newest collections, carefully
          curated to bring you the best in fashion, home decor, and more.
        </p>
      </div>

      {/* ✅ Rendering Product Items */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={item._id || index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;