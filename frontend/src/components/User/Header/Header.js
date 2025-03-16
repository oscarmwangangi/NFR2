import React, { useState, useEffect } from "react";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import BreadcrumbTrail from "../BreadcrumbTrail";

function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle screen size change
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user session data and handle dropdowns
  useEffect(() => {
    const storedData = sessionStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Retrieved user data from session:", parsedData);
      setUser(parsedData.user);
    } else {
      checkSession();
    }

    const handleClickOutside = (event) => {
      if (showAccountDropdown && !event.target.closest(".account-dropdown")) {
        setShowAccountDropdown(false);
      }
      if (showHelpDropdown && !event.target.closest(".help-dropdown")) {
        setShowHelpDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountDropdown, showHelpDropdown]);

  const checkSession = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/check-session`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.message === "Logged out successfully") {
        sessionStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error", error);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Red Bar (Not Sticky) */}
      <div className="bg-red-500 p-3 text-white flex justify-between">
        <h1>Thank you for choosing us</h1>
        <h1>+25417544384</h1>
      </div>

      {/* Sticky Header */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        {isMobile ? (
          <MobileHeader
            user={user}
            showAccountDropdown={showAccountDropdown}
            showHelpDropdown={showHelpDropdown}
            toggleAccountDropdown={() => setShowAccountDropdown((prev) => !prev)}
            toggleHelpDropdown={() => setShowHelpDropdown((prev) => !prev)}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        ) : (
          <DesktopHeader
            user={user}
            showAccountDropdown={showAccountDropdown}
            showHelpDropdown={showHelpDropdown}
            toggleAccountDropdown={() => setShowAccountDropdown((prev) => !prev)}
            toggleHelpDropdown={() => setShowHelpDropdown((prev) => !prev)}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        )}
      </header>

      {/* Rest of the page */}
      <div className="text-white">
        <BreadcrumbTrail />
      </div>
    </>
  );
}

export default Header;
