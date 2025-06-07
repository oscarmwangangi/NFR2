import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { calculateDiscountPercentage } from "./utils/DiscountUtlils.js"; // Import utility function
function Black_Friday() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=25`)
      .then((res) => {
        setProducts(res.data);  // Store the products in the state
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div>
    <div className="bg-gray-900">
    <div className="container bg-gray-900 p-4  text-gray-100 mx-auto ">
      <h2 className="text-2xl font-extrabold text-left mb-8 text-red-500 animate-inch-worm">Black Friday Deal</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {products.length > 0 ? (
          products.map((product) => (

            <div key={product.id} className="bg-gray-800 p-2 rounded-lg shadow-lg relative hover:scale-105 transition-transform">
       {/* Discount Percentage Badge */}
                      {product.discount_price && (
                          <div className="absolute top-2 right-2 bg-red-500 bg-opacity-10 text-[#f5594b] text-sm font-semibold  px-2 py-1 rounded">
                          -{calculateDiscountPercentage(product.price, product.discount_price)}%
                        </div>
                      )}
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg product-item"
              />
              <h3 className="font-bold text-sm truncate">{product.name}</h3>
              {/* <p className="text-sm text-gray-500">{product.description}</p> */}
              <div className="mt-2 flex flex-col">
                <span className="text-xl font-extrabold text-red-400">Ksh {product.discount_price}</span>
                {product.discount_price && (
                  <span className="text-sm text-gray-400 line-through">Ksh {product.price}
                  </span>
                )}
                 <Link
              key={product.id}
              to={`/product/${product.id}`}  // Navigate to product detail page
             
            >
                <div className="inline-block mt-2 w-28 bg-red-500 text-black py-2 px-4 rounded hover:bg-red-600">
                  View Deal
                </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
    </div>
    </div>
  );
}

export default Black_Friday;
