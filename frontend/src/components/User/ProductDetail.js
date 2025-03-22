// ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import 'font-awesome/css/font-awesome.min.css';
import { useCart } from "./Cart/CartContext";
import RecentViewed from "./RecentViewed";
import { useBreadcrumb } from './BreadcrumbContext';
import { calculateDiscountPercentage } from "./utils/DiscountUtlils.js"; // Import utility function
// Component to display the product image.
const ProductImage = ({ imagePath, name }) => (
  <div className="w-full lg:w-1/2">
    <img
      src={`${process.env.REACT_APP_BACKEND_URL}/${imagePath}`}
      alt={name}
      className="w-full h-96 object-cover rounded-lg"
    />
  </div>
);

// Component to display product information, quantity selector, and add-to-cart button.
const ProductInfo = ({ product, quantity, changeQuantity, addToCart }) => (
  <div className="w-full lg:w-1/2 lg:ml-8 mt-4 lg:mt-0">
    <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
    <div className="mt-6 relative">
    {product.discount_price && (
        <span className="text-xl font-bold text-[#313133]">
          Ksh {product.discount_price}
        </span>
      )}
      <span className="text-sm text-gray-500 line-through ml-2">Ksh {product.price}</span>
      <span>
          {/* Discount Percentage Badge */}
                        {product.discount_price && (
                          <div className="absolute top-2 right-2 bg-red-500 bg-opacity-10 text-[#f5594b] text-sm font-semibold  px-2 py-1 rounded">
                            -{calculateDiscountPercentage(product.price, product.discount_price)}%
                          </div>
                        )}
      </span>
    </div>
    <div className="mt-6 flex items-center">
      <button
        onClick={() => changeQuantity(-1)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300 transition duration-300"
      >
        -
      </button>
      <span className="px-4 py-2 bg-gray-100 text-gray-700">{quantity}</span>
      <button
        onClick={() => changeQuantity(1)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 transition duration-300"
      >
        +
      </button>
    </div>
    <button
      onClick={() => addToCart(product, quantity)}
      className="w-full mt-6 p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
    >
      Add to Cart
    </button>
  </div>
);

// Component for the share section.
const ProductShare = () => (
  <div className="container bg-white mx-auto py-8 p-4">
    <p className="font-medium text-gray-700">Share this product:</p>
    <div className="flex space-x-4 mt-2">
      <a href="#" className="text-blue-500 hover:text-blue-700">
        <i className="fa fa-facebook-f"></i>
      </a>
      <a href="#" className="text-gray-700 hover:text-gray-900">
        <i className="fa fa-twitter"></i>
      </a>
      <a href="#" className="text-pink-500 hover:text-pink-700">
        <i className="fa fa-instagram"></i>
      </a>
      <a href="#" className="text-blue-600 hover:text-blue-800">
        <i className="fa fa-linkedin-in"></i>
      </a>
    </div>
  </div>
);

// Component for the product description.
const ProductDescription = ({ description }) => (
  <div className="container bg-white mx-auto py-8 p-4">
    <h1 className="text-2xl font-semibold text-gray-800">Product Description</h1>
    <p className="mt-3 text-lg text-gray-600 max-w-[600px]">{description}</p>
  </div>
);

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToTrail } = useBreadcrumb();

  // Fetch product details based on the URL parameter.
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
      });
  }, [id]);
useEffect(() => {
    if (product) {
      addToTrail(product);
    }
  }, [product, addToTrail]);
  // Scroll to the top whenever the product ID changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Once the product is loaded, add it to the recently viewed list.
  useEffect(() => {
    if (!product) return;

    const user = sessionStorage.getItem("user");
    let recentProducts = [];

    if (user) {
      const stored = sessionStorage.getItem("recentViewed");
      if (stored) recentProducts = JSON.parse(stored);
    } else {
      const stored = localStorage.getItem("recentViewed");
      if (stored) recentProducts = JSON.parse(stored);
    }

    // Remove duplicates and add the new product at the beginning.
    recentProducts = recentProducts.filter((item) => item.id !== product.id);
    recentProducts.unshift(product);
    // Limit the list to the 10 most recent items.
    recentProducts = recentProducts.slice(0, 10);

    if (user) {
      sessionStorage.setItem("recentViewed", JSON.stringify(recentProducts));
    } else {
      localStorage.setItem("recentViewed", JSON.stringify(recentProducts));
    }
  }, [product]);

  const changeQuantity = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="pb-8 pt-4 -mt-3  bg-[#f5f5f5]">
       {/* <Breadcrumb lastCrumb={product.name} linkLast={true} /> */}

      {/* Main product display */}
      <div className="container bg-white mx-auto mt-4 p-4 flex flex-col lg:flex-row items-start">
        <ProductImage imagePath={product.image_path} name={product.name} />
        <ProductInfo
          product={product}
          quantity={quantity}
          changeQuantity={changeQuantity}
          addToCart={addToCart}
        />
      </div>

      {/* Share section */}
      <ProductShare />

      {/* Product description */}
      <div className=" mx-auto items-start ">
      <ProductDescription description={product.description} />
    </div>

      {/* Recently viewed products */}
      <div className="container bg-white mx-auto py-8 p-4">
        <RecentViewed />
      </div>
    </div>
  );
}

export default ProductDetail;
