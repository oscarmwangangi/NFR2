// src/components/HamburgerButton.js
import React from 'react';

function HamburgerButton({ onClick }) {
  return (
    <div
      className="fixed top-5 left-5 cursor-pointer z-50"
      onClick={onClick}
    >
      <div className="w-6 h-0.5 bg-blue-800 my-1.5"></div>
      <div className="w-6 h-0.5 bg-blue-800 my-1.5"></div>
      <div className="w-6 h-0.5 bg-blue-800 my-1.5"></div>
    </div>
  );
}

export default HamburgerButton;