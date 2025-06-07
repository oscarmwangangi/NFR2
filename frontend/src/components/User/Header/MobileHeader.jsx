import React from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { FiShoppingCart } from "react-icons/fi";

import HelpDropdown from "./HelpDropdown";
import AccountDropdown from "./AccountDropdown";
import { useCart } from "../Cart/CartContext"; // Import useCart
function MobileHeader({
  user,
  showAccountDropdown,
  showHelpDropdown,
  toggleAccountDropdown,
  toggleHelpDropdown,
  handleLogout,
  isLoggingOut,
  searchQuery,
  setSearchQuery,
  handleSearch,
  suggestions,
  showSuggestions,
  handleInputChange,
  handleSuggestionClick,
  setShowSuggestions
}) {
    const { cartCount } = useCart(); // Get cart count
  return (
    <div className="md:hidden bg-white shadow-sm">
      {/* Top Section: Logo and Icons */}
      <div className="flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <a href="/">
        <div className="flex items-center space-x-2">
          <img src="/weblogo.png" alt="E-Shop Logo" className="h-16 w-auto" />
        </div>
       </a>
        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Account Dropdown */}
          <AccountDropdown
            user={user}
            showAccountDropdown={showAccountDropdown}
            toggleAccountDropdown={toggleAccountDropdown}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />

          {/* Help Dropdown */}
          <HelpDropdown
            showHelpDropdown={showHelpDropdown}
            toggleHelpDropdown={toggleHelpDropdown}
          />

          {/* Cart Icon */}
            {/* Cart Icon */}
            <Link to="/cart" className="relative flex items-center space-x-1">
          <span className="text-red-500 mr-3 text-xl">  <FiShoppingCart /></span>
          {cartCount > 0 && (
            <div>
          <span className="hover:underline">Cart </span>
          <span className="absolute bg-red-500 text-white text-xs rounded-full px-2">
              {cartCount}
            </span>
         
          </div>
        )}
        </Link>
      </div>
    </div>
       

      {/* Search Bar */}
      <div className="flex-1 mx-4">
  <div className="relative max-w-xl mx-auto  pb-2">
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200"
        value={searchQuery}
        onChange={handleInputChange}
      />
      {/* X icon to clear the search bar */}
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setShowSuggestions(false);
          }}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 focus:outline-none"
        >
          {/* You can replace "×" with an icon component if preferred */}
          ×
        </button>
      )}
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <SearchIcon className="text-gray-500 hover:text-red-500 cursor-pointer" />
      </button>
    </form>

    {/* Dropdown for search suggestions */}
    {showSuggestions && suggestions.length > 0 && (
      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-b-lg shadow-lg z-10">
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 border-b border-gray-200 last:border-0 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>

</div>

     
    </div>
  );
}

export default MobileHeader;