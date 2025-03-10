import React from 'react';

function Sidebar({ isOpen, onItemClick }) {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <ul className="p-10">
        <li
          className="my-4 cursor-pointer"
          onClick={() => onItemClick('Dashboard')}
        >
          Dashboard
        </li>
        <li
          className="my-4 cursor-pointer"
          onClick={() => onItemClick('Add Product')}
        >
          Add Product
        </li>
        <li
          className="my-4 cursor-pointer"
          onClick={() => onItemClick('Manage Product')}
        >
          Manage Product
        </li>
        <li
          className="my-4 cursor-pointer"
          onClick={() => onItemClick('Manage Categories')}
        >
         Manage Categories
        </li>
        <li
          className="my-4 cursor-pointer"
          onClick={() => onItemClick('Orders')}
        >
          Orders
        </li>
        <li
          className="my-4 cursor-pointer"
          onClick={() => onItemClick('Profile')}
        >
          Profile
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
