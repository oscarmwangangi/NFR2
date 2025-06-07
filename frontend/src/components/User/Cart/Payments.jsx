import React, { useState, useEffect } from "react";

const Payments = ({ deliveryAddress, paymentMethod, setPaymentMethod }) => {
  const [phone_number, setphone_number] = useState("");

  // When user selects "Payment on Order", pre-fill phone number from deliveryAddress if available
  useEffect(() => {
    if (paymentMethod === "order" && deliveryAddress?.phone_number) {
      setphone_number(deliveryAddress.phone_number);
    }
  }, [paymentMethod, deliveryAddress]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value); // Update payment method in the parent component
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
      <div className="mb-4">
        <p>Acceptable Payment: Mpesa</p>
      </div>
      <div className="flex space-x-4 mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="delivery"
            checked={paymentMethod === "delivery"}
            onChange={handlePaymentChange}
            className="form-radio"
          />
          <span className="ml-2">Payment on Delivery</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="order"
            checked={paymentMethod === "order"}
            onChange={handlePaymentChange}
            className="form-radio"
          />
          <span className="ml-2">Payment on Order</span>
        </label>
      </div>
      {paymentMethod === "order" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number for Mpesa Payment
          </label>
          <input
            type="text"
            value={phone_number}
            readOnly
            onChange={(e) => setphone_number(e.target.value)}
            placeholder="Enter your phone number"
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Payments;