import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

function ProductDetail() {
  const { id } = useParams(); // Get the product id from the URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products/${id}`) // Fetch product details using the id
      .then((res) => {
        setProduct(res.data); // Store the product data
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
      });
  }, [id]);

  // Function to handle quantity change
  const changeQuantity = (amount) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + amount;
      return newQuantity < 1 ? 1 : newQuantity; // Ensure quantity doesn't go below 1
    });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="py-8 bg-slate-200">
      <div className="container bg-white mx-auto mt-4 p-4 flex flex-col lg:flex-row items-start">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Text and Button Section */}
        <div className="w-full lg:w-1/2 lg:ml-8 mt-4 lg:mt-0">
          <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>

          {/* Price and Discount */}
          <div className="mt-6">
            <span className="text-xl font-bold text-[#313133]">Ksh {product.price}</span>
            {product.discount_price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                Ksh {product.discount_price}
              </span>
            )}
            <p className='p-3'>{product.in_stock}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center">
            <button
              onClick={() => changeQuantity(-1)} // Decrease quantity
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300 transition duration-300"
            >
              -
            </button>
            <span className="px-4 py-2 bg-gray-100 text-gray-700">{quantity}</span>
            <button
              onClick={() => changeQuantity(1)} // Increase quantity
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 transition duration-300"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full mt-6 p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>

      

      {/* Share Section */}
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
      {/* Product Description Section */}
      <div className="container bg-white mx-auto py-8 p-4">
        <h1 className="text-2xl font-semibold text-gray-800">Product Description</h1>
        <p className="mt-3 text-lg text-gray-600">{product.description}</p>
      </div>
    </div>
  );
}

export default ProductDetail;
