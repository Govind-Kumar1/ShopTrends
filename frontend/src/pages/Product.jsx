import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Import Redux actions and thunks
import { fetchProductById, clearCurrentProduct } from '../slices/features/productsSlice';
import { addToCart } from '../slices/features/cartSlice';

// Import components and assets
import RelatedProducts from '../components/RelatedProducts';
import star_icon from '../assets/star_icon.png';
import star_dull_icon from '../assets/star_dull_icon.png';

const Product = () => {
  // ✅ Map whatever param your route has to productId
  const { productId: paramProductId, id: paramId } = useParams();
  const productId = paramProductId || paramId;

  const dispatch = useDispatch();
  const { currentProduct: product, status, error } = useSelector((state) => state.products);
  const currency = '$';

  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [productId, dispatch]);

  useEffect(() => {
    if (product?.image) {
      setImage(product.image[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({ itemId: product._id, size }));
    toast.success('Item added to cart!');
  };

  if (status === 'loading') {
    return <div className='py-20 text-center text-gray-500'>Loading product...</div>;
  }
  if (status === 'failed' || !product) {
    return <div className='py-20 text-center text-red-500'>Error: {error || 'Product not found.'}</div>;
  }

  return (
    <div className='pt-10 transition-opacity duration-500 ease-in border-t-2 opacity-100'>
      <div className='flex flex-col gap-12 sm:gap-12 sm:flex-row'>
        <div className='flex flex-col-reverse flex-1 gap-3 sm:flex-row'>
          <div className='flex justify-between overflow-x-auto sm:flex-col sm:overflow-y-scroll sm:justify-normal sm:w-[18.7%] w-full'>
            {product.image.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => setImage(item)}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${
                  image === item ? 'border-2 border-gray-600 p-1' : ''
                }`}
                alt="Product Thumbnail"
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt="Main Product" />
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='mt-2 text-2xl font-medium'>{product.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[1, 2, 3, 4].map((i) => (
              <img key={i} src={star_icon} alt="Star" className="w-4" />
            ))}
            <img src={star_dull_icon} alt="Empty Star" className="w-4" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>
            {currency}{product.price.toFixed(2)}
          </p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{product.description}</p>

          <div className='flex flex-col gap-4 my-8'>
            <p className='font-semibold'>Select Size</p>
            <div className='flex gap-2'>
              {product.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 rounded-md ${
                    item === size ? 'border-orange-500 font-bold' : ''
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className='px-8 py-3 text-sm text-white bg-black active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />

          <div className='flex flex-col gap-1 mt-5 text-sm text-gray-500'>
            <p>✅ 100% Authentic – Shop with Confidence!</p>
            <p>🚚 Cash on Delivery – Pay at Your Doorstep!</p>
            <p>🔁 10-Day Easy Returns & Exchanges</p>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <div className='flex'>
          <b className='px-5 py-3 text-sm border'>Description</b>
          <p className='px-5 py-3 text-sm border'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 px-6 py-6 text-sm text-gray-500 border'>
          <p>
            Elevate your style with our meticulously crafted Trendify quality
            products. Designed with a perfect balance of elegance and
            practicality, made from premium materials that ensure both
            durability and comfort.
          </p>
          <p>
            Whether you're dressing up for a special occasion or adding a touch
            of sophistication to your everyday look, our products offer
            unparalleled versatility. Don’t miss out on owning a piece that
            combines both form and function—experience the difference today.
          </p>
        </div>
      </div>

      <RelatedProducts
        category={product.category}
        subCategory={product.subCategory}
        currentProductId={product._id}
      />
    </div>
  );
};

export default Product;
