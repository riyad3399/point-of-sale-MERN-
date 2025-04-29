import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AppLayout;