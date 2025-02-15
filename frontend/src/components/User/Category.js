// Category.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Category() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products (the API returns all products; we’ll filter on the client)
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // Extract unique categories.
  // We'll create an object where each key is a category name, and store one representative product for that category.
  const categoryMap = {};
  products.forEach((product) => {
    if (product.category && !categoryMap[product.category]) {
      categoryMap[product.category] = product;
    }
  });
  const distinctCategories = Object.values(categoryMap);

  return (
    <div className="bg-slate-50">
    <div className="container mx-auto p-4 bg-slate-50 py-8">
      <h2 className="text-3xl font-bold mb-6 text-left text-[#313133]">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {distinctCategories.length > 0 ? (
          distinctCategories.map((product) => (
            <Link
              key={product.id}
              to={`/category/${encodeURIComponent(product.category)}`}
              className="block relative overflow-hidden rounded-lg bg-[#f4f4f4] shadow-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl"
            >
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                alt={product.category}
                className="w-full h-48 object-cover filter brightness-[93%] transition-all duration-300 ease-in-out"
              />
              <h3 className="absolute bottom-0 left-0 right-0 p-4 text-xl font-bold text-black text-center drop-shadow-md">
                {product.category}
              </h3>
            </Link>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Category;
