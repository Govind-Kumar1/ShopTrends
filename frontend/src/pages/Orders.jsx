import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../slices/features/orderSlice';
import Title from '../components/Title';
 
const Orders = () => {
  const dispatch = useDispatch();
  const { list: orders, status } = useSelector((state) => state.orders);
  const currency = '$';

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === 'loading') {
    return <p className="text-center py-20">Loading your orders...</p>;
  }
  
  if (status === 'succeeded' && orders.length === 0) {
    return <p className="text-center py-20">You have no past orders.</p>
  }

  return (
    <div className='pt-16 border-t'>
      <div className='text-2xl'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>
      <div className='flex flex-col gap-5 mt-5'>
        {orders.map((order) => (
          <div key={order._id} className='p-4 border rounded-md shadow-sm'>
            <div className="flex justify-between items-center mb-4">
                <p className="font-semibold">Order ID: <span className="font-normal text-gray-600">{order._id}</span></p>
                <p className="font-semibold">Date: <span className="font-normal text-gray-600">{new Date(order.date).toLocaleDateString()}</span></p>
            </div>
            {order.items.map((item, index) => (
              <div key={index} className='flex items-center gap-4 py-3 border-t'>
                <img className='w-16 h-16 object-cover rounded' src={item.image} alt="Product" />
                <div>
                  <p className='font-medium'>{item.name}</p>
                  <p className='text-sm text-gray-600'>Size: {item.size} | Qty: {item.quantity}</p>
                  <p className='text-sm'>{currency}{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 text-sm">
                <div className='flex items-center gap-2'>
                    <p className={`h-2 min-w-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-500'}`}></p>
                    <p>{order.status}</p>
                </div>
                <p className="font-bold text-lg">{currency}{order.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;