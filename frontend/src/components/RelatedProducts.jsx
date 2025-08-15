import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // ✅ Import Redux hook
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  // ✅ Get product list from Redux store
  const { list: products } = useSelector((state) => state.products);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const relatedProducts = products.filter(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          item._id !== currentProductId // ✅ Exclude the current product itself
      );
      setRelated(relatedProducts.slice(0, 5));
    }
    // ✅ Re-run when products or categories change
  }, [products, category, subCategory, currentProductId]);

  if (related.length === 0) {
    return null; // Don't render the section if there are no related products
  }

  return (
    <div className='my-24'>
      <div className='py-2 text-3xl text-center'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;