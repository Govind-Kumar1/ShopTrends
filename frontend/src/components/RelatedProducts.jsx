import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { list: products } = useSelector((state) => state.products);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const relatedProducts = products.filter((item) =>
        item &&
        item.category === category &&
        item.subCategory === subCategory &&
        item._id !== currentProductId
      );
      setRelated(relatedProducts.slice(0, 5));
    }
  }, [products, category, subCategory, currentProductId]);

  if (!Array.isArray(related) || related.length === 0) {
    return null;
  }

  return (
    <div className="my-24">
      <div className="py-2 text-3xl text-center">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image || []} // ✅ safe default
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
