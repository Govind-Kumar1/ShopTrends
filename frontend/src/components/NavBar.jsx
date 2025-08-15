import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // ✅ Import Redux hooks
import { toast } from 'react-toastify';

// ✅ Import Redux Actions and Selectors
import { setShowSearch } from '../slices/features/uiSlice';
import { clearCart } from '../slices/features/cartSlice';
import { clearToken } from '../slices/features/userSlice';
import { selectCartCount } from '../selectors/cartSelectors';

// ✅ Assets 
import logo from "../assets/logo.png";
import search_icon from "../assets/search_icon.png";
import dropdown_icon from "../assets/dropdown_icon.png";
import cart_icon from "../assets/cart_icon.png";
import profile_icon from "../assets/profile_icon.png";
import menu_icon from "../assets/menu_icon.png";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Get the dispatch function

  // ✅ Get state and derived data from the Redux store
  const token = useSelector((state) => state.user.token);
  const cartCount = useSelector(selectCartCount);

  const handleLogout = () => {
    dispatch(clearToken()); // ✅ Dispatches action to clear token from state and localStorage
    dispatch(clearCart());  // ✅ Dispatches action to clear the cart
    toast.success("Logged out successfully 👋");
    navigate("/");
  };

  return (
    <>
      {/* SearchBar is now rendered in App.jsx, so it's removed from here to avoid duplication */}
      <div className='flex items-center justify-between py-5 font-medium relative z-50 bg-white'>
        {/* Logo */}
        <Link to='/'>
          <img src={logo} className='w-40' alt="Trendify" />
        </Link>

        {/* Desktop Navigation */}
        <ul className='hidden gap-5 text-sm text-gray-700 sm:flex'>
          <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>HOME</p>
          </NavLink>
          <NavLink to='/product/list' className='flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
          </NavLink>
          <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>ABOUT</p>
          </NavLink>
          <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>CONTACT</p>
          </NavLink>
        </ul>

        {/* Right Side Icons */}
        <div className='flex items-center gap-6'>
          {/* Search */}
          <img
            onClick={() => dispatch(setShowSearch(true))} // ✅ Dispatch action
            src={search_icon}
            className='w-5 cursor-pointer'
            alt="Search"
          />

          {/* Profile */}
          <div className='relative group'>
            <img src={profile_icon} className='w-5 cursor-pointer' alt="Profile" />
            <div className='absolute right-0 pt-4 hidden group-hover:block'>
              <div className='flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100 shadow-md'>
                {/* ✅ UI reacts to the token from the Redux store */}
                {token ? (
                  <>
                    <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                    <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Logout</p>
                  </>
                ) : (
                  <Link to='/login' className='hover:text-black'>Login</Link>
                )}
              </div>
            </div>
          </div>

          {/* Cart */}
          <Link to='/cart' className='relative'>
            <img src={cart_icon} className='w-5 min-w-5' alt="Cart" />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
              {cartCount} {/* ✅ Use the value from the selector */}
            </p>
          </Link>

          {/* Mobile Menu */}
          <img
            onClick={() => setVisible(true)}
            src={menu_icon}
            className='w-5 cursor-pointer sm:hidden'
            alt="Menu"
          />
        </div>

        {/* Mobile Sidebar */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
          <div className='flex flex-col text-gray-600'>
            <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
              <img src={dropdown_icon} className='h-4 rotate-180' alt="Back" />
              <p>Back</p>
            </div>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/product/list'>COLLECTION</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;