import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden rounded-md">
        <div className="w-full h-48 sm:h-52 md:h-56 lg:h-60 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
            src={image[0]}
            alt={name}
          />
        </div>
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p> 
      <p className="text-sm font-medium">
        {currency}&nbsp;
        {price.toLocaleString(undefined, { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </Link>
  );
};

export default ProductItem;
