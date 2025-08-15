import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import the new selector and the update action
import { selectCartDetails } from '../selectors/cartSelectors';
import { updateQuantity } from '../slices/features/cartSlice';

// Import Components and Assets
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import bin_icon from '../assets/bin_icon.png';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get fully detailed cart data directly using the new selector
  const cartDetails = useSelector(selectCartDetails);
  const currency = '$'; // Define as a constant

  const isCartEmpty = cartDetails.length === 0;

  // Handler for updating quantity
  const handleUpdateQuantity = (itemId, size, newQuantity) => {
    dispatch(updateQuantity({ itemId, size, quantity: newQuantity }));
  };

  // If cart is empty, show message
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
        {/* ✅ Map directly over the detailed cart data. No more .find()! */}
        {cartDetails.map((item, index) => (
          <div key={`${item._id}-${item.size}`} className='grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
            <div className='flex items-start gap-6'>
              <img className='w-16 sm:w-20' src={item.image} alt="Product" />
              <div>
                <p className='text-sm font-medium sm:text-lg'>{item.name}</p>
                <div className='flex items-center gap-5 mt-2'>
                  <p>
                    {currency}&nbsp;{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className='px-2 border sm:px-3 sm:py-1 bg-slate-50'>{item.size}</p>
                </div>
              </div>
            </div>
            <input
              onChange={(e) => handleUpdateQuantity(item._id, item.size, Number(e.target.value))}
              className='px-1 py-1 border max-w-10 sm:max-w-20 sm:px-2'
              type="number"
              min={1}
              value={item.quantity}
            />
            <img
              onClick={() => handleUpdateQuantity(item._id, item.size, 0)} // Set quantity to 0 to remove
              className='w-4 mr-4 cursor-pointer sm:w-5'
              src={bin_icon}
              alt="Remove"
            />
          </div>
        ))}
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