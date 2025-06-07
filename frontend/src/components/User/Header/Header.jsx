import React, { useState, useEffect } from "react";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import BreadcrumbTrail from "../BreadcrumbTrail";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios"
function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Handle screen size change
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [suggestions, setSuggestions] = useState([]); // State for search suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to control dropdown visibility

  // Function to clear the search bar
  const clearSearch = () => {
    setSearchQuery(""); // Clear the search query
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide the dropdown
  };
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  

  // Fetch search suggestions as the user types
  const fetchSuggestions = async (query) => {
    if (query.trim()) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/products/suggestions?q=${query}`
        );
        setSuggestions(response.data); // Set the fetched suggestions
        setShowSuggestions(true); // Show the dropdown
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if the query is empty
      setShowSuggestions(false); // Hide the dropdown
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the search query
    fetchSuggestions(query); // Fetch suggestions
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    // Optionally update the search input, if needed
    setSearchQuery(suggestion.name);
    // Hide the suggestions dropdown
    setShowSuggestions(false);
    // Navigate directly to the product detail page
    navigate(`/product/${suggestion.id}`);
  };
  
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


  return (
    <>
      {/* Red Bar (Not Sticky) */}
      <div className="bg-red-500 p-2 text-white flex justify-between">
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
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        handleInputChange={handleInputChange}
        handleSuggestionClick={handleSuggestionClick}
        setSuggestions={setSuggestions}         // Pass down here if needed
        setShowSuggestions={setShowSuggestions}
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
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          handleInputChange={handleInputChange}
          handleSuggestionClick={handleSuggestionClick}
          setSuggestions={setSuggestions}         // Pass down here if needed
          setShowSuggestions={setShowSuggestions}
          />
        )}
      </header>

      {/* Rest of the page */}
      {/* Conditionally render BreadcrumbTrail on pages other than home */}
      {location.pathname !== "/" && (
        <div className=" bg-[#f5f5f5]">
          <BreadcrumbTrail />
        </div>
      )}
    </>
  );
}

export default Header;
