// Products.js (Main Component)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { calculateDiscountPercentage } from "./utils/DiscountUtlils.js";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=Products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="container mx-auto p-4 bg-white">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.length > 0 ? (
            products.slice(0, 12).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-item group cursor-pointer p-4 rounded-lg hover:shadow-lg transition-all relative"
              >
                {product.discount_price && (
                  <div className="absolute top-2 right-2 bg-red-500 bg-opacity-10 text-[#f5594b] text-sm font-semibold px-2 py-1 rounded">
                    -{calculateDiscountPercentage(product.price, product.discount_price)}%
                  </div>
                )}
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h3 className="text-sm font-semibold text-[#313133] truncate-text">{product.name}</h3>
                <div className="mt-2 flex flex-col">
                  {product.discount_price ? (
                    <>
                      <span className="text-xl font-bold text-[#313133]">
                        Ksh {product.discount_price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        Ksh {product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-[#313133]">
                      Ksh {product.price}
                    </span>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <p>No products available in this category.</p>
          )}
        </div>
        {products.length > 12 && (
          <div className="text-center mt-4">
            <Link to="/products" state={{ category: 'Products' }} className="text-blue-500 hover:underline">
              See More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;