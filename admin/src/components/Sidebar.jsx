import React from "react";
import { NavLink } from "react-router-dom";

import order_icon from '../assets/order_icon.png'
import add_icon from '../assets/add_icon.png'
import parcel_icon from '../assets/parcel_icon.png'
const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className={
            "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
          }
          to={"/product/addItem"}
        >
          <img className="w-6 h-6" src={add_icon} alt="Add Items" />
          <p className="hidden text-lg font-semibold md:block">Add Items</p>
        </NavLink>
        <NavLink
          className={
            "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
          }
          to={"/list"}
        >
          <img className="w-6 h-6" src={parcel_icon} alt="List Items" /> 
          <p className="hidden text-lg font-semibold md:block">List Items</p>
        </NavLink>
        <NavLink
          className={
            "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
          }
          to={"/orders"}
        >
          <img className="w-6 h-6" src={order_icon} alt="Add Products" />
          <p className="hidden text-lg font-semibold md:block">View Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
