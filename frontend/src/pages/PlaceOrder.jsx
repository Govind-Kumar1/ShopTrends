import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectCartDetails, selectCartTotalAmount } from '../selectors/cartSelectors';
import { placeOrder } from '../slices/features/orderSlice';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';

// Import Components, Selectors, and Actions
// import Title from '../components/Title';
// import CartTotal from '../components/CartTotal';
// import { selectCartDetails, selectCartTotalAmount } from '../selectors/cartSelectors';
// import { placeOrder } from '../slices/orderSlice';
// import { clearCart } from '../slices/cartSlice';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart data and total amount from Redux
  const cartItems = useSelector(selectCartDetails);
  const subTotal = useSelector(selectCartTotalAmount);
  const deliveryFee = subTotal > 0 ? 10 : 0;

  // State to manage the delivery information form
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  // Handler to update form data as the user types
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  // Function to handle the order placement
  const handlePlaceOrder = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const orderData = {
      address: data,
      items: cartItems,
      amount: subTotal + deliveryFee,
    };

    try {
      // Dispatch the placeOrder thunk and wait for it to complete
      await dispatch(placeOrder(orderData)).unwrap();

      // If successful, clear the cart state and navigate
      dispatch(clearCart());
      toast.success("Order Placed Successfully!");
      navigate("/orders");

    } catch (error) {
      toast.error(error || "Failed to place order. Please try again.");
    }
  };
  
  // Redirect if cart is empty
  useEffect(() => {
    if (subTotal === 0) {
      navigate('/cart');
    }
  }, [subTotal, navigate]);


  return (
    <form onSubmit={handlePlaceOrder} className='flex flex-col justify-between gap-10 pt-10 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      
      {/* Left Side - Delivery Information */}
      <div className='flex flex-col w-full gap-4 sm:max-w-xl'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} className='w-full px-4 py-2 border border-gray-300 rounded' type="email" placeholder='Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required name='city' onChange={onChangeHandler} value={data.city} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Mobile' />
      </div>

      {/* Right Side - Cart Totals & Place Order Button */}
      <div className='flex-1 w-full'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
          <div className='w-full mt-8 text-end'>
            <button type='submit' className='w-full px-16 py-3 text-sm text-white bg-black sm:w-auto active:bg-gray-800'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder;