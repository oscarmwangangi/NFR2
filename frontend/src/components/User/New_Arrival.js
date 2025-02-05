import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function New_Arrival() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=New Arrival`)
      .then((res) => {
        setProducts(res.data);  // Store the products in the state
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-extrabold text-left mb-8 text-black new-arrivals-typewriter">New Arrival</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
            key={product.id}
            to={`/product/${product.id}`}  // Navigate to product detail page
            
          >
            <div key={product.id} className="product-item group cursor-pointer p-4 rounded-lg hover:shadow-lg transition-all">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg product-item"
              />
              <h3 className="text-sm font-semibold text-[#313133] truncate-text">{product.name}</h3>
              {/* <p className="text-sm text-gray-500">{product.description}</p> */}
              <div className="mt-2 flex flex-col">
                <span className="text-xl font-bold text-[#313133]">Ksh {product.price}</span>
                {product.discount_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.discount_price}
                  </span>
                )}
              </div>
            </div>
            </Link>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
}

export default New_Arrival;
