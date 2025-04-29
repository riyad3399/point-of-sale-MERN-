import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Left Side - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 w-full input h-9 bg-gray-50"
            />
          </div>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button className="btn-outline btn-sm mr-2">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        {/* Right Side - User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button 
            className="btn-outline btn-sm relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-600 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </motion.button>
          
          {/* User Menu */}
          <div className="relative">
            <motion.button 
              className="flex items-center gap-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white">
                    {currentUser?.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
            </motion.button>
            
            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div 
                className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </a>
                <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;