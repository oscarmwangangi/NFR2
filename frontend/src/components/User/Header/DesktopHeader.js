import React from "react";
import { Link } from "react-router-dom";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MobileHeader from "./MobileHeader";
import HelpDropdown from "./HelpDropdown";
import AccountDropdown from "./AccountDropdown";
import { useCart } from "../Cart/CartContext"; // Import useCart

function DesktopHeader({
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
    <div className="hidden md:flex justify-between items-center px-16 bg-white shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center ml-5 space-x-2">
        <img src="/weblogo.png" alt="E-Shop Logo" className="h-16 w-auto" />
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-4">
  <div className="relative max-w-xl mx-auto">
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full border border-red-200 rounded-full py-2 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200 placeholder-gray-400 placeholder:text-sm"
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
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
      >
        <SearchIcon className="text-red-400 hover:text-red-500 cursor-pointer" />
      </button>
    </form>

    {/* Dropdown for search suggestions */}
    {showSuggestions && suggestions.length > 0 && (
      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-b-lg shadow-lg z-10">
        <ul className="px-4">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 border-b border-red-50 last:border-0 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-200 text-gray-500 text-sm"
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



      {/* Navigation Icons */}
      <div className="flex items-center space-x-8">
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
        <Link to="/cart" className="relative flex items-center space-x-1">
          <ShoppingCartIcon />
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
  );
}

export default DesktopHeader;