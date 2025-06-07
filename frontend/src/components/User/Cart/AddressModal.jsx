import React, { useEffect, useState } from "react";

const AddressModal = ({
  deliveryAddress: initialDeliveryAddress, // Address data from the database
  setDeliveryAddress, // Function to update the parent state
  setShowAddressModal, // Function to close the modal
  addressSuggestions, // Suggestions for address autocomplete
  setAddressSuggestions, // Function to update address suggestions
  userInfo, // User information (read-only)
  saveAddress, // Function to save the address to the database
}) => {
  // Local state to manage the form inputs
  const [localAddress, setLocalAddress] = useState({
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

  // Initialize local state when the modal is opened or `initialDeliveryAddress` changes
  useEffect(() => {
    if (initialDeliveryAddress) {
      setLocalAddress({
        street: initialDeliveryAddress.street || "",
        phone_number: initialDeliveryAddress.phone_number || "",
        city: initialDeliveryAddress.city || "",
        state: initialDeliveryAddress.state || "",
        postal_code: initialDeliveryAddress.postal_code || "",
        google_place_id: initialDeliveryAddress.google_place_id || "",
        building_name: initialDeliveryAddress.building_name || "",
        apartment_number: initialDeliveryAddress.apartment_number || "",
        address_label: initialDeliveryAddress.address_label || "",
      });
    }
  }, [initialDeliveryAddress]);

  // Handle changes in the form inputs
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    // Prevent updating read-only fields
    if (name === "first_name" || name === "second_name" || name === "email") {
      return;
    }

    // Update the local state
    setLocalAddress((prev) => ({ ...prev, [name]: value }));

    // Fetch address suggestions if the street field is being updated
    if (name === "street" && !localAddress.google_place_id) {
      if (value.trim() === "") {
        setAddressSuggestions([]);
        return;
      }
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: value }, (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setAddressSuggestions(predictions);
          } else {
            setAddressSuggestions([]);
          }
        });
      }
    }
  };

  // Handle saving the address
  const handleSave = () => {
    // Update the parent state with the local address
    setDeliveryAddress(localAddress);
    // Call the saveAddress function to save the address to the database
    saveAddress();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Update Address</h3>

        <div className="space-y-2">
          {/* Street Input */}
          <input
            type="text"
            name="street"
            placeholder="Search for a place"
            value={localAddress.street || ""}
            onChange={handleAddressChange}
            className="border p-2 w-full rounded"
          />
          {/* Postal Code Input */}
          <input
            type="text"
            name="postal_code"
            placeholder="Postal Code *"
            value={localAddress.postal_code || ""}
            onChange={handleAddressChange}
            className="border p-2 w-full rounded"
          />
          {/* Phone Number Input */}
          <input
            type="text"
            name="phone_number"
            placeholder="Enter phone number"
            value={localAddress.phone_number || ""}
            onChange={handleAddressChange}
            className="border p-2 w-full rounded"
          />
          {/* Address Suggestions */}
          {addressSuggestions.length > 0 && (
            <ul className="border p-2 rounded bg-gray-50 max-h-40 overflow-auto">
              {addressSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="cursor-pointer hover:bg-gray-200 p-1"
                  onClick={() => {
                    setLocalAddress((prev) => ({
                      ...prev,
                      street: suggestion.description,
                      google_place_id: suggestion.place_id,
                    }));
                    setAddressSuggestions([]);
                  }}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4 mt-4">
          {/* Google Map Preview */}
          {localAddress.google_place_id && (
            <div className="w-full h-48">
              <iframe
                title="Google Map Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
                  localAddress.street
                )}`}
                allowFullScreen
              ></iframe>
            </div>
          )}
          {/* Building Name Input */}
          <input
            type="text"
            name="building_name"
            placeholder="Building Name *"
            value={localAddress.building_name || ""}
            onChange={handleAddressChange}
            className="border p-2 w-full rounded"
          />
          {/* Apartment Number Input */}
          <input
            type="text"
            name="apartment_number"
            placeholder="Apartment Number *"
            value={localAddress.apartment_number || ""}
            onChange={handleAddressChange}
            className="border p-2 w-full rounded"
          />
          {/* City Input */}
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={localAddress.city || ""}
            onChange={handleAddressChange}
            className="border p-2 w-full rounded"
          />
          {/* Read-Only User Info */}
          <input
            type="text"
            name="first_name"
            placeholder="First Name *"
            value={userInfo.first_name || ""}
            disabled
            className="border p-2 w-full rounded bg-gray-100"
          />
          <input
            type="text"
            name="second_name"
            placeholder="Last Name"
            value={userInfo.second_name || ""}
            disabled
            className="border p-2 w-full rounded bg-gray-100"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userInfo.email || ""}
            disabled
            className="border p-2 w-full rounded bg-gray-100"
          />
          {/* Address Label Input */}
          <input
            type="text"
            name="address_label"
            placeholder="Address Label"
            value={localAddress.address_label || ""}
            onChange={handleAddressChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setShowAddressModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;