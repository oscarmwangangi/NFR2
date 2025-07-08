import React from 'react';
import {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  Folder,
  ShoppingBag,
  MessageSquareText,
  User,
  Menu,
  X
} from 'lucide-react';

function Sidebar({ isOpen, toggleSidebar, onItemClick }) {
  // Icon colors based on their purpose
  const iconColors = {
    Dashboard: '#6366f1',       // Indigo
    'Add Product': '#10b981',   // Emerald
    'Manage Product': '#f59e0b', // Amber
    'Manage Categories': '#8b5cf6', // Violet
    Orders: '#ef4444',          // Red
    Chat: '#3b82f6',            // Blue
    Profile: '#ec4899'          // Pink
  };

  const menu = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} color={iconColors['Dashboard']} />, key: 'Dashboard' },
    { label: 'Add Product', icon: <PackagePlus size={20} color={iconColors['Add Product']} />, key: 'Add Product' },
    { label: 'Manage Product', icon: <Boxes size={20} color={iconColors['Manage Product']} />, key: 'Manage Product' },
    { label: 'Manage Categories', icon: <Folder size={20} color={iconColors['Manage Categories']} />, key: 'Manage Categories' },
    { label: 'Orders', icon: <ShoppingBag size={20} color={iconColors['Orders']} />, key: 'Orders' },
    { label: 'Chat', icon: <MessageSquareText size={20} color={iconColors['Chat']} />, key: 'Chat' },
    { label: 'Profile', icon: <User size={20} color={iconColors['Profile']} />, key: 'Profile' },
  ];

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className={`fixed z-50 top-4 left-4 p-2 rounded-md transition-all duration-300 ${
          isOpen ? 'bg-[#1a0000] left-[17rem]' : 'bg-[#130000] left-4'
        } text-[#f0d6d6] hover:bg-[#2a0a0a] shadow-md`}
      >
        {isOpen ? <X size={24} color="#f0d6d6" /> : <Menu size={24} color="#f0d6d6" />}
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-[#000000] bg-opacity-20 text-[#ffff] transition-all duration-300 shadow-lg z-40 ${
          isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
        } overflow-hidden border-r border-[#2a0a0a]`}
      >
        <div className="p-6 font-bold text-xl border-b border-[#2a0a0a] flex items-center gap-2">
          <div className="bg-[#1a0000] p-2 rounded-lg">
            <LayoutDashboard size={20} color={iconColors['Dashboard']} />
          </div>
          <span className="text-[#f5e1e1]">Admin Panel</span>
        </div>
        
        <ul className="p-4 space-y-1">
          {menu.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1f0404] cursor-pointer transition-colors duration-200"
              onClick={() => onItemClick(item.key)}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0f0000] border-t border-[#2a0a0a] text-center text-sm text-[#cc9999]">
          © {new Date().getFullYear()} Admin Panel
        </div>
      </div>
    </>
  );
}

export default Sidebar;