import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DesktopHeader from "./DesktopHeader";

import HelpDropdown from "./HelpDropdown";
import AccountDropdown from "./AccountDropdown";


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
  }) {
    return (
      <div className="md:hidden">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center space-x-2">
            <StorefrontIcon className="text-blue-600" fontSize="large" />
            <span className="text-xl font-bold">E-Shop</span>
          </div>
          <div className="flex items-center space-x-4">
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
            <button className="flex items-center space-x-1 focus:outline-none hover:underline">
              <ShoppingCartIcon />
              <span>Cart</span>
            </button>
          </div>
        </div>
  
        <div className="px-4 pb-2">
          <form onSubmit={handleSearch} className="relative">
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
      </div>
    );
  } export default MobileHeader