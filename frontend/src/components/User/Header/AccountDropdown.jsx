import React from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"; // For Orders
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // For Saved Items
import SettingsIcon from "@mui/icons-material/Settings"; // For Account
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // For Logout
import LoginIcon from "@mui/icons-material/Login"; // For Sign In

function AccountDropdown({
  user,
  showAccountDropdown,
  toggleAccountDropdown,
  handleLogout,
  isLoggingOut,
}) {
  return (
    <div className="relative">
      {/* Account Button */}
      <button
        onClick={toggleAccountDropdown}
        className="flex items-center space-x-1 focus:outline-none group"
      >
        <AccountCircleIcon className="text-gray-700 transition-colors duration-200" />
        <span className="text-gray-700  transition-colors duration-200">
          {user ? `${user.first_name} ${user.second_name}` : "Account"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {showAccountDropdown && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10 account-dropdown">
          <ul>
            {/* Orders */}
            <Link to="/orders">
              <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors duration-200">
                <ShoppingBagIcon className="text-gray-600" />
                <span>Orders</span>
              </li>
            </Link>

            {/* Saved Items */}
            <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors duration-200">
              <FavoriteBorderIcon className="text-gray-600" />
              <span>Saved Items</span>
            </li>

            {/* Account */}
            <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors duration-200">
              <SettingsIcon className="text-gray-600" />
              <span>Account</span>
            </li>

            {/* Logout or Sign In */}
            {user ? (
              <li
                className={`px-4 py-2 flex items-center space-x-2 ${
                  !isLoggingOut
                    ? "hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer"
                    : "opacity-50"
                } transition-colors duration-200`}
                onClick={!isLoggingOut ? handleLogout : undefined}
              >
                <ExitToAppIcon className="text-gray-600" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </li>
            ) : (
              <Link to="/login">
                <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors duration-200">
                  <LoginIcon className="text-gray-600" />
                  <span>Sign In</span>
                </li>
              </Link>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AccountDropdown;