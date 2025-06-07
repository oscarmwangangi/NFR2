import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Menu, X } from "lucide-react";
import { FiShoppingBag, FiWatch, FiZap, FiStar } from "react-icons/fi";
// import { FiTShirt } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

function Carousel() {
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
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
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=29`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCarouselProducts(res.data);
        } else if (res.data.products && Array.isArray(res.data.products)) {
          setCarouselProducts(res.data.products);
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
    autoplaySpeed: 4000,
    arrows: true,
    appendDots: dots => (
      <div className="custom-dots-container">
        <ul className="custom-dots">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="custom-dot">
        <FiStar className="text-red-500" />
      </div>
    )
  };

  const category = [
    { name: "Bags", icon: <FiShoppingBag className="mr-2" /> },
    { name: "Clothing" },
    { name: "Bracelets", icon: <FiWatch className="mr-2" /> },
    { name: "Jewelery", icon: <FiZap className="mr-2" /> }
  ];

  return (
    <div className="container mx-auto p-4 relative">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-col md:flex-row mt-4 gap-6">
        {/* Categories Panel */}
        <div
          className={`md:block bg-white shadow-xl rounded-xl p-6 w-full md:w-64 transition-all duration-300 ${
            menuOpen 
              ? "absolute top-16 right-4 z-40 md:static shadow-2xl"
              : "hidden md:block"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center text-red-600">
            <FiShoppingBag className="mr-2" />
            Categories
          </h2>
          <ul className="space-y-2">
            {category.map((cat, index) => (
              <Link
               to={`/categories/${cat.name}`}
              >
              <li
                key={index}
                className="flex items-center p-3 rounded-lg hover:bg-red-50 cursor-pointer transition-colors text-gray-700 hover:text-red-600"
              >
                {cat.icon}
                {cat.name}
              </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Carousel */}
        <div className="flex-1 overflow-hidden rounded-xl shadow-xl">
          {carouselProducts.length > 0 ? (
            <Slider {...sliderSettings}>
              {carouselProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                    alt={product.name}
                    className="w-full h-96 object-cover mx-auto transform transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-3xl font-bold mb-2">{product.name}</h3>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full flex items-center transition-colors">
                        Shop Now
                        <FiShoppingBag className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="h-96 bg-red-50 flex items-center justify-center rounded-xl">
              <p className="text-red-500 text-xl">Loading featured products...</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-dots-container {
          position: absolute;
          bottom: 20px;
          width: 100%;
        }
        
        .custom-dots li button:before {
          color: #ef4444 !important;
          font-size: 12px !important;
        }
        
        .custom-dots li.slick-active button:before {
          color: #ef4444 !important;
        }
        
        .slick-prev:before,
        .slick-next:before {
          color: #ef4444 !important;
          font-size: 28px !important;
        }
        
        .slick-prev {
          left: 20px !important;
          z-index: 1;
        }
        
        .slick-next {
          right: 20px !important;
        }
      `}</style>
    </div>
  );
}

export default Carousel;