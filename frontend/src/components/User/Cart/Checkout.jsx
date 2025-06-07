import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCart } from "./CartContext"; // Adjust path if needed
import DeliveryAddress from "./DeliveryAddress";
import ScheduleDelivery from "./ScheduleDelivery";
import ItemDetails from "./ItemDetails";
import CartSummary from "./CartSummary";
import AddressModal from "./AddressModal";
import SlotModal from "./SlotModal";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import ProgressBar from "./ProgressBar"; // Import the ProgressBar component
import Payments from "./Payments";

const Checkout = () => {
  
  const { cart,clearCart } = useCart();
  const shippingCost = 200;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;
  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [userInfo, setUserInfo] = useState({ first_name: "", email: "", second_name: "" });
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    phone_number: "",
    city: "",
    state: "",
    postal_code: "",
    google_place_id: "",
    building_name: "",
    apartment_number: "",
    address_label: "",
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [deliverySlot, setDeliverySlot] = useState({ date: "", slot: "" });
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [isScheduleFilled, setIsScheduleFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Calculate currentStep based on completion status
  const currentStep = (isAddressFilled ? 1 : 0) + (isScheduleFilled ? 1 : 0);

  // Check session and fetch user info
  const checkSession = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/check-session`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (data.user) {
        setUserInfo({
          id: data.user.id, // Make sure this field is available from the session
          first_name: data.user.first_name,
          second_name: data.user.second_name,
          email: data.user.email,
        });
      }
      
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  // Fetch user info on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Fetch saved delivery address and slot on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch delivery address
        const addressResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delivery-address`, {
          withCredentials: true,
        });
        if (addressResponse.data) {
          setDeliveryAddress({
            street: addressResponse.data.street || "",
            phone_number: addressResponse.data.phone_number || "",
            city: addressResponse.data.city || "",
            state: addressResponse.data.state || "",
            postal_code: addressResponse.data.postal_code || "",
            google_place_id: addressResponse.data.google_place_id || "",
            building_name: addressResponse.data.building_name || "",
            apartment_number: addressResponse.data.apartment_number || "",
            address_label: addressResponse.data.address_label || "",
          });
          setIsAddressFilled(true);
        }

        // Fetch delivery slot
        const slotResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delivery-slot`, {
          withCredentials: true,
        });
        if (slotResponse.data && slotResponse.data.date && slotResponse.data.slot) {
          setDeliverySlot(slotResponse.data);
          setIsScheduleFilled(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  // Save address to DB
  const saveAddress = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/delivery-address`, deliveryAddress, {
        withCredentials: true,
      });
      toast.success("Address updated successfully!");
      setShowAddressModal(false);
      setIsAddressFilled(true);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.");
    }
  };

  // Handle delivery slot selection
  const handleSlotSelection = useCallback((slot) => {

      setDeliverySlot(slot);
      setIsScheduleFilled(true);
  
      // Send the selected slot to the backend
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/delivery-slot`, {
          date: slot.date,
          slot: slot.slot,
        }, { withCredentials: true })
        .then((res) => {
          toast.success("Delivery slot updated successfully!");
        })
        .catch((err) => {
          console.error("Error updating delivery slot:", err);
          toast.error("Failed to update delivery slot.");
        });
    
  }, [deliverySlot]);
  // Check if both address and schedule are filled
  const isCheckoutComplete = isAddressFilled && isScheduleFilled;

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-6">
      <div className="bg-white flex justify-between items-center px-16">
        <div>
          <img src="/weblogo.png" alt="E-Shop Logo" className="h-20 w-auto" />
        </div>
        <div className="flex space-x-10 items-center">
          <div className="flex flex-row justify-center items-center text-[#75757A]">
            <VerifiedUserIcon />
            <span className="font-semibold p-1">
              <p className="mb-1 leading-none">secure</p>
              <p className="mb-0 leading-none">payments</p>
            </span>
          </div>

          <div className="flex flex-row justify-center items-center text-[#75757A]">
            <OfflineBoltIcon />
            <span className="font-semibold p-1">
              <p className="mb-1 leading-none">fast</p>
              <p className="mb-0 leading-none">delivery</p>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 ">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="container pt-8 mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left Side: Delivery Address, Schedule a Delivery, and Item Details */}
        <div className="space-y-6">
        <Payments
          deliveryAddress={deliveryAddress}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          
        />
          <DeliveryAddress
            userInfo={userInfo}
            deliveryAddress={deliveryAddress}
            setShowAddressModal={setShowAddressModal}
            onAddressFilled={() => setIsAddressFilled(true)}
          />
          <ScheduleDelivery
            deliverySlot={deliverySlot}
            setShowSlotModal={setShowSlotModal}
            onSlotFilled={handleSlotSelection}
          />
          <ItemDetails cart={cart} />
        </div>

        {/* Right Side: Cart Summary */}
        <CartSummary 
          subtotal={subtotal} 
          shippingCost={shippingCost} 
          total={total} 
          isCheckoutComplete={isCheckoutComplete} 
          paymentMethod={paymentMethod}
          cart={cart}
          deliveryAddress={deliveryAddress}
          deliverySlot={deliverySlot}
          userInfo={userInfo}
          clearCart={clearCart} // Pass the function here
        />
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          deliveryAddress={deliveryAddress}
          setDeliveryAddress={setDeliveryAddress}
          setShowAddressModal={setShowAddressModal}
          addressSuggestions={addressSuggestions}
          setAddressSuggestions={setAddressSuggestions}
          userInfo={userInfo}
          saveAddress={saveAddress}
        />
      )}

      {/* Delivery Slot Modal */}
      {showSlotModal && (
  <SlotModal
    deliverySlot={deliverySlot}
    setDeliverySlot={setDeliverySlot}
    setShowSlotModal={setShowSlotModal}
    handleSlotSelection={handleSlotSelection} // Pass handleSlotSelection
  />
)}

      <ToastContainer />
    </div>
  );
};

export default Checkout;











































