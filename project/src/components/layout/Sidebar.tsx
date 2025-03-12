import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bed, 
  Stethoscope, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Bed Management', path: '/beds', icon: <Bed size={20} /> },
    { name: 'Equipment', path: '/equipment', icon: <Stethoscope size={20} /> },
    { name: 'Staff', path: '/staff', icon: <Users size={20} /> },
    { name: 'Scheduling', path: '/scheduling', icon: <Calendar size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    { name: 'Bed Optimizer', path: '/bed-optimizer', icon: <Bed size={20} /> },
  ];

  if (isMobile && !isOpen) return null;

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'hidden md:flex'} flex-col w-64 h-screen bg-gray-900`}>
      <div className="flex items-center justify-between h-16 px-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <Stethoscope className="h-8 w-8 mr-2" />
          <span className="text-xl font-semibold">MedResource</span>
        </div>
        {isMobile && (
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700">
            <X size={24} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              end={item.path === '/'}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors">
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;