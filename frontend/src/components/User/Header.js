import React, { useState } from "react";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import weblogo from '../../../public/weblogo.png'
function Header() {
  // Dropdown state for Account and Help menus
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);

  // Click handlers toggle dropdown visibility
  const toggleAccountDropdown = () => setShowAccountDropdown(prev => !prev);
  const toggleHelpDropdown = () => setShowHelpDropdown(prev => !prev);

  return (
    <header className="bg-white shadow-md">
      {/* For medium and larger screens: a single row header */}
      <div className="hidden md:flex justify-between items-center px-16 ">
        {/* Left: Website Icon and Name */}
        <div className="flex items-center ml-5 space-x-2">
      {/* Use the <img> tag to display the logo */}
      <img src="/weblogo.png"alt="E-Shop Logo" className="h-20 w-auto " /> {/* Adjust height and width as needed */}
      {/* <span className="text-xl font-bold">E-Shop</span> */}
    </div>

        {/* Center: Search Bar */}
        <div className="flex-1 mx-4">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Right: Account, Help, and Cart */}
        <div className="flex items-center space-x-8">
          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={toggleAccountDropdown}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <AccountCircleIcon />
              <span>Account</span>
            </button>
            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Saved Items</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Account</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In</li>
                </ul>
              </div>
            )}
          </div>
          {/* Help Dropdown */}
          <div className="relative">
            <button
              onClick={toggleHelpDropdown}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <HelpOutlineIcon />
              <span>Help</span>
            </button>
            {showHelpDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Help Center</li>
                </ul>
              </div>
            )}
          </div>
          {/* Cart */}
          <button className="flex items-center space-x-1 focus:outline-none">
            <ShoppingCartIcon />
            <span>Cart</span>
          </button>
        </div>
      </div>

      {/* For small screens: two rows */}
      <div className="md:hidden">
        {/* Top Row: Icon and Right Items */}
        <div className="flex justify-between items-center px-4 py-2">
          {/* Left: Website Icon and Name */}
          <div className="flex items-center space-x-2">
            <StorefrontIcon className="text-blue-600" fontSize="large" />
            <span className="text-xl font-bold">E-Shop</span>
          </div>
          {/* Right: Account, Help, and Cart */}
          <div className="flex items-center space-x-4">
            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={toggleAccountDropdown}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <AccountCircleIcon />
                <span>Account</span>
              </button>
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Saved Items</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Account</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In</li>
                  </ul>
                </div>
              )}
            </div>
            {/* Help Dropdown */}
            <div className="relative">
              <button
                onClick={toggleHelpDropdown}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <HelpOutlineIcon />
                <span>Help</span>
              </button>
              {showHelpDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Help Center</li>
                  </ul>
                </div>
              )}
            </div>
            {/* Cart */}
            <button className="flex items-center space-x-1 focus:outline-none">
              <ShoppingCartIcon />
              <span>Cart</span>
            </button>
          </div>
        </div>
        {/* Bottom Row: Search Bar */}
        <div className="px-4 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
