import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
const Footer = () => {
  // State for back-to-top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll event handler
  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  // Scroll to the top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Use effect to handle the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-100">
      {/* Back to Top Bar */}
      {showBackToTop && (
        <div
          className="w-full bg-gray-800 text-white py-3 text-center hover:cursor-pointer hover:bg-gray-700"
          onClick={scrollToTop}
        >
          <span className="text-sm font-semibold hover:underline">Back to Top</span>
        </div>
      )}

      {/* Footer Content */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto py-[3.3rem] px-6">
          {/* Top Section */}
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Business Name */}
            <div>
              <h2 className="text-lg font-bold text-red-500">NFR Products</h2>
              <p className="mt-2 text-sm">Premium products for every occasion.</p>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-lg font-semibold text-center">Sign up to our newsletter</h3>
              <p className="text-sm mt-2 text-center">Receive news and updates about our products.</p>
              <form className="flex flex-col sm:flex-row justify-center mt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-red-400"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-gray-900 font-bold rounded-r-md hover:bg-red-500 focus:outline-none"
                >
                  Sign Up
                </button>
              </form>
            </div>

            {/* Social Media & Payment */}
            <div>
              <h3 className="text-lg font-semibold">Connect with us</h3>
              <p className="text-sm mt-2">Follow us on all our social media pages.</p>
              <div className="flex space-x-4 mt-4">
                {/* Social Media Icons */}
                <a href="#" className="text-red-400 text-2xl hover:text-red-500" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-red-400 text-2xl hover:text-red-500" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-red-400 text-2xl hover:text-red-500" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <h4 className="text-lg font-semibold mt-6">Payment Method</h4>
              <div className="inline-flex items-center">
                <img src="images/M-PESA_LOGO-01.svg" alt="M-Pesa Logo" className="h-16 w-auto" />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 mt-10">
            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold">Customer Service</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="hover:text-red-400 text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <Link 
                  to="chat" className="hover:text-red-400 text-sm">
                    Live Chat
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-red-400 text-sm">
                    Report Abuse
                  </a>
                </li>
              </ul>
            </div>

            {/* About NFR */}
            <div>
              <h3 className="text-lg font-bold">About NFR</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="hover:text-red-400 text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-400 text-sm">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-400 text-sm">
                    Return and Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-right mt-10 text-gray-500">
            <p>© {new Date().getFullYear()} NFR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
