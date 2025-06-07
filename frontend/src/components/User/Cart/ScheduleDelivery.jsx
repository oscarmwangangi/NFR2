// ScheduleDelivery.js
import React, { useEffect } from "react";

const ScheduleDelivery = ({
  deliverySlot,
  setShowSlotModal,
  onSlotFilled,
}) => {
  useEffect(() => {
    if (deliverySlot.date && deliverySlot.slot) {
      onSlotFilled(deliverySlot);
    }
  }, [deliverySlot, onSlotFilled]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Schedule a Delivery</h2>
      {deliverySlot.date && deliverySlot.slot ? (
        <div className="mb-4">
          <p>
            <strong>Date:</strong> {deliverySlot.date}
          </p>
          <p>
            <strong>Time Slot:</strong> {deliverySlot.slot}
          </p>
        </div>
      ) : (
        <p className="mb-4">No delivery slot selected.</p>
      )}
      <button
        onClick={() => setShowSlotModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Change Slot
      </button>
    </div>
  );
};

export default ScheduleDelivery;
