import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none md:hidden"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <div className="mr-2 text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;