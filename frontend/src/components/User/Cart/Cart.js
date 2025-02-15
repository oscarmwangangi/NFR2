// Cart.js
import React from "react";
import { useCart } from "./CartContext";

function Cart() {
  const { cart, updateCartItemQuantity } = useCart();

  const handleQuantityChange = (itemId, change) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity < 1) return;
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
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
                  <span className="px-4 py-2 bg-gray-100 text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 transition duration-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xl font-semibold">
                Total: Ksh {item.price * item.quantity}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
