import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

import AccountDropdown from "./AccountDropdown";


function HelpDropdown({ showHelpDropdown, toggleHelpDropdown }) {
    return (
      <div className="relative">
        <button
          onClick={toggleHelpDropdown}
          className="flex items-center space-x-1 focus:outline-none hover:underline"
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
    );
  } export default HelpDropdown