import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
 // Make sure this path is correct
import bin_icon from '../assets/bin_icon.png'; // Import the bin icon
const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // ✅ CHANGE 1: useEffect ko update karein
  useEffect(() => {
    // Ab yeh `products` ka intezaar nahi karega.
    // Jaise hi cartItems milega, yeh code chal jaayega.
    const tempData = [];
    if (cartItems) {
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]); // ✅ CHANGE 2: Dependency se 'products' ko hata dein

  const isCartEmpty = cartData.length === 0;

  // Agar cart khaali hai toh message dikhayein
  if (isCartEmpty) {
    return (
      <div className='border-t pt-14 text-center min-h-[50vh] flex flex-col justify-center items-center'>
        <Title text1={'YOUR CART IS'} text2={'EMPTY'} />
        <p className='mt-4 text-gray-600'>Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate('/product/list')}
          className='mt-8 px-8 py-3 text-sm text-white bg-black active:bg-gray-700'
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className='pt-14 border-t'>
      <div className='mb-3 text-2xl'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);

          // Yeh check ab bhi zaroori hai. Yeh item ko tab tak nahi dikhayega jab tak uski product details load na ho jayein.
          if (!productData) {
            return null;
          }

          return (
            <div key={index} className='grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="Product" />
                <div>
                  <p className='text-sm font-medium sm:text-lg'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>
                      {currency}&nbsp;{productData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className='px-2 border sm:px-3 sm:py-1 bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                className='px-1 py-1 border max-w-10 sm:max-w-20 sm:px-2'
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='w-4 mr-4 cursor-pointer sm:w-5'
                src={bin_icon} 
                alt="Remove"
              />
            </div>
          );
        })}
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => navigate('/place-order')}
              className={`px-8 py-3 my-8 text-sm text-white bg-black active:bg-gray-700 ${isCartEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isCartEmpty}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
}

export default Cart;