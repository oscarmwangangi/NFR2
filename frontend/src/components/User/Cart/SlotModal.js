import React from "react";

const SlotModal = ({ deliverySlot, setDeliverySlot, setShowSlotModal, handleSlotSelection }) => {
  const timeslots = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Select Delivery Slot</h3>
        <div className="space-y-4">
          <input
            type="date"
            value={deliverySlot.date}
            onChange={(e) =>
              setDeliverySlot((prev) => ({ ...prev, date: e.target.value }))
            }
            className="border p-2 w-full rounded"
          />
          <div className="space-y-2">
            {timeslots.map((slot) => (
              <button
                key={slot}
                onClick={() =>
                  setDeliverySlot((prev) => ({ ...prev, slot }))
                }
                className="w-full text-left px-4 py-2 border rounded hover:bg-gray-100"
              >
                {slot} Available
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setShowSlotModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSlotSelection(deliverySlot); // Call handleSlotSelection
              setShowSlotModal(false); // Close the modal
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotModal;























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { useCart } from "./CartContext"; // Adjust path if needed
// import DeliveryAddress from "./DeliveryAddress";
// import ScheduleDelivery from "./ScheduleDelivery";
// import ItemDetails from "./ItemDetails";
// import CartSummary from "./CartSummary";
// import AddressModal from "./AddressModal";
// import SlotModal from "./SlotModal";
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
// import ProgressBar from "./ProgressBar"; // Import the ProgressBar component

// const Checkout = () => {
//   const { cart } = useCart();
//   const shippingCost = 200;
//   const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const total = subtotal + shippingCost;

//   const [userInfo, setUserInfo] = useState({ first_name: "", email: "", second_name: "" });
//   const [deliveryAddress, setDeliveryAddress] = useState({
//     street: "",
//     phone_number: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     googlePlaceId: "",
//   });
  
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [addressSuggestions, setAddressSuggestions] = useState([]);
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [deliverySlot, setDeliverySlot] = useState({ date: "", slot: "" });
//   const [showSlotModal, setShowSlotModal] = useState(false);

//   // Track completion status
//   const [isAddressFilled, setIsAddressFilled] = useState(false);
//   const [isScheduleFilled, setIsScheduleFilled] = useState(false);

//   // Calculate currentStep based on completion status
//   const currentStep = (isAddressFilled ? 1 : 0) + (isScheduleFilled ? 1 : 0);

//   // Check session and fetch user info
//   const checkSession = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/check-session`, {
//         method: "GET",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//       const data = await res.json();
//       if (data.user) {
//         setUserInfo({
//           first_name: data.user.first_name,
//           second_name: data.user.second_name,
//           email: data.user.email,
//         });
//       }
//     } catch (error) {
//       console.error("Error checking session:", error);
//     }
//   };

//   // Fetch user info on mount
//   useEffect(() => {
//     checkSession();
//   }, []);

//   // Save address to DB
//   const saveAddress = () => {
//     axios
//       .post(`${process.env.REACT_APP_BACKEND_URL/api/delivery-address`, deliveryAddress, { withCredentials: true })
//       .then((res) => {
//         toast.success("Address updated successfully!");
//         setShowAddressModal(false);
//         setIsAddressFilled(true); // Mark address as filled
//       })
//       .catch((err) => {
//         console.error("Error updating address:", err);
//         toast.error("Failed to update address.");
//       });
//   };

//   // Handle delivery slot selection
//   const handleSlotSelection = (slot) => {
//     setDeliverySlot(slot);
//     setIsScheduleFilled(true); // Mark schedule as filled

//     // Send the selected slot to the backend
//     axios
//       .post(`${process.env.REACT_APP_BACKEND_URL}/api/delivery-slot`, {
//         date: slot.date,
//         slot: slot.slot,
//       }, { withCredentials: true })
//       .then((res) => {
//         toast.success("Delivery slot updated successfully!");
//       })
//       .catch((err) => {
//         console.error("Error updating delivery slot:", err);
//         toast.error("Failed to update delivery slot.");
//       });
//   };
//   useEffect(() => {
//     // Fetch saved delivery address
//     axios
//       .get(`${process.env.REACT_APP_BACKEND_URL}/api/delivery-address`, { withCredentials: true })
//       .then((res) => {
//         if (res.data && res.data.street) {
//           // Update deliveryAddress state with the fetched data, including phone_number
//           setDeliveryAddress({
//             street: res.data.street,
//             city: res.data.city,
//             state: res.data.state,
//             postalCode: res.data.postal_code,
//             googlePlaceId: res.data.google_place_id,
//             phone_number: res.data.phone_number, // Include phone_number
//           });
//           setIsAddressFilled(true);
//         }
//       })
//       .catch((err) => {
//         console.error("No saved delivery address:", err);
//       });

  
//     // Fetch saved delivery slot
//     axios
//       .get(`${process.env.REACT_APP_BACKEND_URL}/api/delivery-slot`, { withCredentials: true })
//       .then((res) => {
//         if (res.data && res.data.date && res.data.slot) {
//           setDeliverySlot(res.data);
//           setIsScheduleFilled(true);
//         }
//       })
//       .catch((err) => {
//         console.error("No saved delivery slot:", err);
//       });
//   }, []);
  
//   // Check if both address and schedule are filled
//   const isCheckoutComplete = isAddressFilled && isScheduleFilled;

//   return (
//     <div className="bg-[#f5f5f5] min-h-screen pb-6">
//       <div className="bg-white flex justify-between items-center px-16">
//         <div>
//           <img src="/weblogo.png" alt="E-Shop Logo" className="h-20 w-auto" />
//         </div>
//         <div className="flex space-x-10 items-center">
//           <div className="flex flex-row justify-center items-center text-[#75757A]">
//             <VerifiedUserIcon />
//             <span className="font-semibold p-1">
//               <p className="mb-1 leading-none">secure</p>
//               <p className="mb-0 leading-none">payments</p>
//             </span>
//           </div>

//           <div className="flex flex-row justify-center items-center text-[#75757A]">
//             <OfflineBoltIcon />
//             <span className="font-semibold p-1">
//               <p className="mb-1 leading-none">fast</p>
//               <p className="mb-0 leading-none">delivery</p>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="container mx-auto px-4 ">
//         <ProgressBar currentStep={currentStep} />
//       </div>

//       <div className="container pt-8 mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
//         {/* Left Side: Delivery Address, Schedule a Delivery, and Item Details */}
//         <div className="space-y-6">
//           <DeliveryAddress
//             userInfo={userInfo}
//             deliveryAddress={deliveryAddress}
//             setShowAddressModal={setShowAddressModal}
//             onAddressFilled={() => setIsAddressFilled(true)} // Pass callback
//           />
//             <ScheduleDelivery
//         deliverySlot={deliverySlot}
//         setShowSlotModal={setShowSlotModal}
//         onSlotFilled={handleSlotSelection} // Pass callback
//       />
//           <ItemDetails cart={cart} />
//         </div>

//         {/* Right Side: Cart Summary */}
//         <CartSummary 
//         subtotal={subtotal} 
//         shippingCost={shippingCost} 
//         total={total} 
//         isCheckoutComplete={isCheckoutComplete} 
//         />
       
//       </div>

//       {/* Address Modal */}
//       {showAddressModal && (
//         <AddressModal
//           deliveryAddress={deliveryAddress}
//           setDeliveryAddress={setDeliveryAddress}
//           setShowAddressModal={setShowAddressModal}
//           addressSuggestions={addressSuggestions}
//           setAddressSuggestions={setAddressSuggestions}
//           userInfo={userInfo}
//           saveAddress={saveAddress}
//         />
//       )}

//       {/* Delivery Slot Modal */}
//       {showSlotModal && (
//         <SlotModal
//           deliverySlot={deliverySlot}
//           setDeliverySlot={setDeliverySlot}
//           setShowSlotModal={setShowSlotModal}
//         />
//       )}




//       <ToastContainer />
//     </div>
//   );
// };

// export default Checkout;