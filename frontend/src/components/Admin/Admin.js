// src/pages/Admin.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import HamburgerButton from './HamburgerButton';
import Dashboard from './Partials/Dashboard';
import AddProduct from './Partials/AddProduct';
import ManageProduct from './Partials/ManageProduct';
import ManageCategories from './Partials/ManageCategories';
import Orders from './Partials/Orders';
import Profile from './Partials/Profile';

function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HamburgerButton onClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onItemClick={handleItemClick} />
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-10'} p-5`}
      >
        <h1 className="text-2xl font-bold">Admin Page Content</h1>

        {/* Dynamically render content based on the active item */}
        {activeItem === 'Dashboard' && <Dashboard />}
        {activeItem === 'Add Product' && <AddProduct />}
        {activeItem === 'Manage Product' && <ManageProduct />}
        {activeItem === 'Manage Categories' && <ManageCategories />}
        {activeItem === 'Orders' && <Orders />}
        {activeItem === 'Profile' && <Profile />}
      </div>
    </div>
  );
}

export default Admin;
