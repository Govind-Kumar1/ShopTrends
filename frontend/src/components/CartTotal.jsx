import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    // Context se values le rahe hain
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    // getCartAmount ko ek hi baar call karke variable mein store kar liya
    const subTotal = getCartAmount();

    // Agar cart khaali hai (subTotal 0 hai), toh shipping fee 0 hogi
    const shippingFee = subTotal > 0 ? delivery_fee : 0;

    // Final total calculate kar liya
    const totalAmount = subTotal + shippingFee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                {/* Title ko 'TOTALS' kar diya hai, jo behtar lagta hai */}
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