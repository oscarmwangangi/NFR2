import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { calculateDiscountPercentage } from "./utils/DiscountUtlils.js"; // Import utility function
function Top_Selling() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=Top Selling`)
      .then((res) => {
        setProducts(res.data);  // Store the products in the state
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="bg-white">
    <div className="container bg-white mx-auto p-4 ">
      <h2 className="text-3xl font-bold text-left mb-8 text-gray-800">Top Selling</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
            key={product.id}
            to={`/product/${product.id}`}  // Navigate to product detail page
          >
            <div key={product.id} className="block bg-white p-4 rounded-lg relative shadow-md hover:shadow-lg transition">
           {/* Discount Percentage Badge */}
           {product.discount_price && (
                          <div className="absolute top-2 right-2 bg-red-500 bg-opacity-10 text-[#f5594b] text-sm font-semibold  px-2 py-1 rounded">
                          -{calculateDiscountPercentage(product.price, product.discount_price)}%
                        </div>
                      )}
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                alt={product.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-semibold text-sm text-[#313133] truncate">{product.name}</h3>
              {/* <p className="text-sm text-gray-500">{product.description}</p> */}
              <div className="mt-2 flex flex-col">
              {product.discount_price && (
                  <span className="text-xl font-bold text-[#313133]">
                    {product.discount_price}
                  </span>
                )}
                <span className="text-sm text-gray-500 line-through">Ksh {product.price}</span>
               
              </div>
            </div>
            </Link>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
    </div>
    
  );
}

export default Top_Selling;
