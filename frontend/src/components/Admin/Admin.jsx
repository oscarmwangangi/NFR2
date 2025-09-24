// src/pages/Admin.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Partials/Dashboard';
import AddProduct from './Partials/AddProduct';
import ManageProduct from './Partials/ManageProduct';
import ManageCategories from './Partials/ManageCategories';
import Orders from './Partials/Orders';
import Profile from './Partials/Profile';
import AdminChat from './AdminChat';

function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    // Optional: Close sidebar when an item is selected on mobile
    // if (window.innerWidth < 768) {
    //   setIsSidebarOpen(false);
    // }
  };

  return (
    <div className="min-h-screen bg-[#1a0000] text-white font-sans relative">
      {/* Sidebar now contains its own toggle button */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        onItemClick={handleItemClick} 
      />
      
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        } p-5`}
      >
        {/* Main content header */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold p-8">{activeItem}</h1>
        </div>

        {/* Dynamically render content based on the active item */}
        {activeItem === 'Dashboard' && <Dashboard />}
        {activeItem === 'Add Product' && <AddProduct />}
        {activeItem === 'Manage Product' && <ManageProduct />}
        {activeItem === 'Manage Categories' && <ManageCategories />}
        {activeItem === 'Orders' && <Orders />}
        {activeItem === 'Chat' && <AdminChat />}
        {activeItem === 'Profile' && <Profile />}
      </div>
    </div>
  );
}

export default Admin;