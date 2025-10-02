import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto p-4 bg-slate-50 py-8">
        <h2 className="text-3xl font-bold mb-6 text-left text-[#313133]">
          Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => {
              const imageUrl = `${process.env.REACT_APP_BACKEND_URL}/${category.image_path}`;
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="block relative overflow-hidden rounded-lg bg-[#f4f4f4] shadow-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl"
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = "/download.png"; // Fallback image
                    }}
                    className="w-full h-48 object-cover filter brightness-[93%] transition-all duration-300 ease-in-out"
                  />
                  <h3 className="absolute bottom-0 left-0 right-0 p-4 text-xl font-bold text-black text-center drop-shadow-md">
                    {category.name}
                  </h3>
                </Link>
              );
            })
          ) : (
            <p>No categories available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
