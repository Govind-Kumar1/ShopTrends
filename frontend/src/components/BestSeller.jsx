import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // ✅ Import the useSelector hook
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  // ✅ Get the products list from the Redux store
  const { list: products } = useSelector((state) => state.products);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const bestProducts = products.filter((item) => item.bestSeller);
      setBestSeller(bestProducts.slice(0, 5));
    }
  }, [products]); // The dependency now correctly refers to the products from Redux

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Our best sellers are a curated selection of top-rated items that have
          won over shoppers with their quality, style, and value.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {bestSeller.map((item) => (
          <ProductItem
            key={item._id}
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

export default BestSeller;