import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpCenterIcon from "@mui/icons-material/HelpCenter"; // For Help Center
import ContactSupportIcon from "@mui/icons-material/ContactSupport"; // For Contact Support
import InfoIcon from "@mui/icons-material/Info"; // For FAQs

function HelpDropdown({ showHelpDropdown, toggleHelpDropdown }) {
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  return (
    <div className="relative">
      {/* Help Button */}
      <button
        onClick={toggleHelpDropdown}
        className="flex items-center space-x-1 focus:outline-none group"
      >
        <HelpOutlineIcon className="text-gray-700  transition-colors duration-200" />
        <span className="text-gray-700 transition-colors duration-200">
          Help
        </span>
      </button>

      {/* Dropdown Menu */}
      {showHelpDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 help-dropdown">
          <ul>
            {/* Help Center */}
            <Link to="/help">
              <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors duration-200">
                <HelpCenterIcon className="text-gray-600" />
                <span>Help Center</span>
              </li>
            </Link>

            {/* Contact Support */}
            <Link to="/contact-support">
              <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors duration-200">
                <ContactSupportIcon className="text-gray-600" />
                <span>Contact Support</span>
              </li>
            </Link>

            {/* FAQs */}
            <Link to="/faqs">
              <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors duration-200">
                <InfoIcon className="text-gray-600" />
                <span>FAQs</span>
              </li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}

export default HelpDropdown;