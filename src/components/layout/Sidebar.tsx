import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {BiLogoProductHunt } from "react-icons/bi";

import { 
  LayoutDashboard, ShoppingCart, Package, FileText, Settings, CreditCard,
  
} from 'lucide-react';
import { MdCategory } from 'react-icons/md';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex w-64 bg-primary-600 text-white flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <motion.div
          className="text-xl font-bold flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CreditCard className="h-6 w-6" />
          <span>ModernPOS</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-8 px-3">
        <div className="space-y-1">
          <SidebarLink to="/" icon={<LayoutDashboard />} text="Dashboard" />
          <SidebarLink
            to="/categories"
            icon={<MdCategory size={26}/>}
            text="Categories"
          />
          <SidebarLink to="/productes" icon={<BiLogoProductHunt size={26}/>} text="Productes" />
          <SidebarLink to="/pos" icon={<ShoppingCart />} text="Point of Sale" />
          <SidebarLink to="/inventory" icon={<Package />} text="Inventory" />
          <SidebarLink
            to="/transactions"
            icon={<FileText />}
            text="Transactions"
          />
          <SidebarLink to="/settings" icon={<Settings />} text="Settings" />
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-700 mt-auto">
        <div className="text-sm text-primary-200">
          <p>ModernPOS System</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, text }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-2 px-3 py-3 rounded-md transition-colors
         ${isActive ? 'bg-primary-700 text-white' : 'text-primary-200 hover:text-white hover:bg-primary-700/50'}`
      }
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        {icon}
      </motion.div>
      <span>{text}</span>
    </NavLink>
  );
};

export default Sidebar;