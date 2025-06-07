import React from "react";

const ItemDetails = ({ cart }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Item Details</h2>
      {cart && cart.length > 0 ? (
        cart.map((item, index) => (
          <div
            key={item.id}
            className="space-y-2 border-b pb-2 mb-2 last:border-0 last:pb-0"
          >
            <p>
              <strong>Item {index + 1}:</strong> {item.name}
            </p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: KSh {item.price} each</p>
          </div>
        ))
      ) : (
        <p>No items in your cart.</p>
      )}
    </div>
  );
};

export default ItemDetails;