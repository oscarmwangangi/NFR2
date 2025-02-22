import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartSummary = ({
  subtotal,
  shippingCost,
  total,
  isCheckoutComplete,
  paymentMethod, // "order" or "delivery"
  cart,
  deliveryAddress,
  deliverySlot,
  userInfo,
  clearCart, // function passed from parent to clear cart state
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOrder = async () => {
    if (isLoading) return;
    setIsLoading(true);
  
    const phone = deliveryAddress.phone_number.replace(/[^0-9]/g, ''); // Clean the phone number
    const data = {
      user: userInfo,
      cart,
      deliveryAddress,
      deliverySlot,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      phone, // Use the cleaned phone number
      amount: total,
    };
  
    console.log("Order payload:", data); // Debug log
    console.log("Phone number:", phone); // Debug log
  
    try {
      if (paymentMethod === "order") {
        // First, insert the order with status "pending"
        const orderResponse = await axios.post("http://localhost:5000/api/order", data, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
  
        console.log("Order response:", orderResponse.data); // Debug log
  
        if (orderResponse.data.success) {
          // Now initiate payment
          const paymentResponse = await axios.post(
            "http://localhost:5000/api/initiate_payment",
            { phone, amount: total }, // Ensure phone and amount are included
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          console.log("phone response:", phone); 
          
          console.log("Payment response:", paymentResponse.data); // Debug log
  
          if (paymentResponse.data.success) {
            toast.success("Payment initiated successfully!");
            clearCart();
          } else {
            toast.error("Payment initiation failed.");
          }
        } else {
          toast.error("Order placement failed.");
        }
      } else {
        // For delivery or other payment methods, simply create order
        const response = await axios.post("http://localhost:5000/api/order", data, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
  
        console.log("Order response:", response.data); // Debug log
  
        if (response.data.success) {
          toast.success("Order placed successfully!");
          clearCart();
        } else {
          toast.error("Order placement failed.");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      toast.error("An error occurred while placing the order.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white sticky top-5 p-6 rounded-lg shadow h-fit">
      <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>KSh {subtotal}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>KSh {shippingCost}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between mb-4">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">KSh {total}</span>
      </div>
      <button
        onClick={handleOrder}
        disabled={!isCheckoutComplete || isLoading}
        className={`w-full px-4 py-6 rounded-lg font-semibold transition duration-300 ${
          isCheckoutComplete && !isLoading
            ? "bg-red-500 hover:bg-red-700 text-white"
            : "bg-gray-400 cursor-not-allowed text-white"
        }`}
      >
        {isLoading ? "Processing..." : isCheckoutComplete ? "Proceed to Payment" : "Please complete setting up"}
      </button>
    </div>
  );
};

export default CartSummary;