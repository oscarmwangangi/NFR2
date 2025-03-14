import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import DesktopHeader from "./DesktopHeader";
// import MobileHeader from "./MobileHeader";
// import HelpDropdown from "./HelpDropdown";


function AccountDropdown({
    user,
    showAccountDropdown,
    toggleAccountDropdown,
    handleLogout,
    isLoggingOut,
    
  }) {
    return (
      <div className="relative">
        <button
          onClick={toggleAccountDropdown}
          className="flex items-center space-x-1 focus:outline-none"
        >
         <AccountCircleIcon />
         <span className="hover:underline">
          {user ? `${user.first_name} ${user.second_name}` : "Account"}
        </span>



</button>
        {showAccountDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 account-dropdown">
            <ul>
          
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><Link to="/orders">Orders</Link></li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Saved Items</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Account</li>
              {user ? (
                <>
                  {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {user.first_name} {user.second_name}
                  </li> */}
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={!isLoggingOut ? handleLogout : undefined}
                    style={{ opacity: isLoggingOut ? 0.5 : 1 }}
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </li>
                </>
              ) : (
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/login" className="block w-full h-full">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  } export default AccountDropdown