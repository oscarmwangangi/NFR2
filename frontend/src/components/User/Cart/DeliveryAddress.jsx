// DeliveryAddress.js
import React, { useEffect } from "react";

const DeliveryAddress = ({
  userInfo,
  deliveryAddress,
  setShowAddressModal,
  onAddressFilled,
  
  setDeliveryAddress, // Ensure this prop is passed
}) => {
  useEffect(() => {
    if (deliveryAddress.building_name && deliveryAddress.city) {
      onAddressFilled();
    }
  }, [deliveryAddress, onAddressFilled]);

  return (
    <div className="bg-white p-6 rounded-lg shadow relative">
      <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
      <p className="mb-2">
        <strong>Name:</strong>{" "}
        {userInfo.first_name && userInfo.second_name
          ? `${userInfo.first_name} ${userInfo.second_name}`
          : "Loading..."}
      </p>
      <p className="mb-4">
        <strong>Email:</strong> {userInfo.email || "Loading..."}
      </p>
      <p className="mb-2">
      <strong>Address:</strong>{" "}
      {deliveryAddress.street ? deliveryAddress.street : "No address selected"}
      
      <strong className="ml-2">Number:</strong>{" "}
      {deliveryAddress.phone_number ? deliveryAddress.phone_number : "No number selected"}
    </p>

      <button
        onClick={() => setShowAddressModal(true)}
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Change Address
      </button>
    </div>
  );
};

export default DeliveryAddress;
