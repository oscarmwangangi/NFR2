import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MobileHeader from "./MobileHeader";
import HelpDropdown from "./HelpDropdown";
import AccountDropdown from "./AccountDropdown";


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
  }) {
    return (
      <div className="hidden md:flex justify-between items-center px-16">
        <div className="flex items-center ml-5 space-x-2">
          <img src="/weblogo.png" alt="E-Shop Logo" className="h-20 w-auto" />
        </div>
  
        <div className="flex-1 mx-4">
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </form>
        </div>
  
        <div className="flex items-center space-x-8">
          <AccountDropdown
            user={user}
            showAccountDropdown={showAccountDropdown}
            toggleAccountDropdown={toggleAccountDropdown}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
          <HelpDropdown
            showHelpDropdown={showHelpDropdown}
            toggleHelpDropdown={toggleHelpDropdown}
          />
          <button className="flex items-center space-x-1 focus:outline-none">
            <ShoppingCartIcon />
            <span className="hover:underline">Cart</span>
          </button>
        </div>
      </div>
    );
  } export default DesktopHeader;