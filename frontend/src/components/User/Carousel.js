// Carousel.js
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Menu, X } from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Carousel() {
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=Carousel`)
      .then((res) => {
        console.log("Carousel API response:", res.data);
        // Adjust according to the structure of your API response:
        if (Array.isArray(res.data)) {
          setCarouselProducts(res.data);
        } else if (res.data.products && Array.isArray(res.data.products)) {
          setCarouselProducts(res.data.products);
        } else {
          console.error("Unexpected API response format:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching carousel products:", err));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container mx-auto p-4">
      {/* Hamburger Menu */}
      <button
        className="md:hidden flex items-center p-2 bg-gray-200 rounded-md shadow-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-col md:flex-row mt-4">
        {/* Categories Panel */}
        <div
          className={`md:static bg-black text-white bg-opacity-70 shadow-md rounded-lg p-4 w-full md:w-1/5 transition-transform duration-300 ease-in-out ${
            menuOpen ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          <ul>
            <li className="mb-1 cursor-pointer hover:text-blue-600 p-2">Bags</li>
            <li className="mb-1 cursor-pointer hover:text-blue-600 p-2">Clothing</li>
            <li className="mb-1 cursor-pointer hover:text-blue-600 p-2">Bracelets</li>
            <li className="mb-1 cursor-pointer hover:text-blue-600 p-2">Jewelery</li>
          </ul>
        </div>

        {/* Carousel */}
        <div className="w-full md:w-4/5 p-4">
          {Array.isArray(carouselProducts) && carouselProducts.length > 0 ? (
            <Slider {...sliderSettings}>
              {carouselProducts.map((product) => (
                <div key={product.id} className="px-2">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p>Loading carousel...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carousel;
