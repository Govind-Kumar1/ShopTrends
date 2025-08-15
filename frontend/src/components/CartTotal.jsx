import React from 'react';
import { useSelector } from 'react-redux'; // ✅ Import Redux hook
import { selectCartTotalAmount } from '../selectors/cartSelectors'; // ✅ Import the selector
import Title from './Title';

const CartTotal = () => {
  // ✅ Get the subtotal from the Redux store using a selector
  const subTotal = useSelector(selectCartTotalAmount);

  // ✅ Define static values as constants
  const currency = '$';
  const delivery_fee = 10;

  // If the cart is empty (subTotal is 0), the shipping fee is 0
  const shippingFee = subTotal > 0 ? delivery_fee : 0;

  // Calculate the final total
  const totalAmount = subTotal + shippingFee;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <div className='flex flex-col gap-3 mt-4'>
        {/* Sub Total */}
        <div className='flex justify-between text-lg font-medium'>
          <p>Subtotal</p>
          <p>
            {currency}&nbsp;{subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <hr />

        {/* Shipping Fee */}
        <div className='flex justify-between text-lg font-medium'>
          <p>Shipping Fee</p>
          <p>
            {currency}&nbsp;{shippingFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <hr />

        {/* Total Amount */}
        <div className='flex justify-between text-2xl font-semibold'>
          <p>Total</p>
          <p>
            {currency}&nbsp;{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;