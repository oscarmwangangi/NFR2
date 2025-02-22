// Cart.js
import React, { useState } from "react";
import { useCart } from "./CartContext";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { animate, scroll } from "motion"
function Cart() {
  const { cart, updateCartItemQuantity, confirmRemoveItem, cartCount } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleRemoveItem = (itemId) => {
    setShowConfirm(true);
    setItemToRemove(itemId);
  };

  const handleQuantityChange = (itemId, change) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity < 1) return;
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const confirmRemoval = () => {
    if (itemToRemove !== null) {
      confirmRemoveItem(itemToRemove);
      setShowConfirm(false);
      setItemToRemove(null);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Shopping Cart ({cartCount} items)
        </h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Cart Items */}
          <div className="flex-1">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-sm p-6">
                <svg
                  className="w-16 h-16 text-red-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  Your cart is empty
                </p>
                <p className="text-gray-500 text-center">
                  Looks like you haven't added anything to your cart yet.
                  Start shopping to fill it up!
                </p>
                <Link to="/">
                  <button className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300">
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <ul className="bg-white p-4 rounded-lg shadow">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between border-b py-3">
                    <div>
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/${item.image_path}`}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded"
                      />
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p>Price: Ksh {item.price}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300 transition duration-300"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 bg-gray-100 text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 transition duration-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-xl font-semibold">
                        Total: Ksh {item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
  
          {/* Right: Cart Summary */}
          {cart.length > 0 && (
            <div className="w-full sticky top-20 lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit">
              <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>KSh {subtotal}</span>
              </div>
              <Link to={`/checkout?subtotal=${subtotal}&shippingCost=200`}>
              <button
                className="w-full mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                // Ensure you have a handler for checkout
              >
                Checkout (KSh {subtotal})
              </button>
              </Link>
            </div>
          )}
        </div>
      </div>
  
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6">
              Do you really want to remove this item from the cart?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRemoval}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
export default Cart;
