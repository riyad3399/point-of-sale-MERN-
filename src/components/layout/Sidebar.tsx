import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BiLogoProductHunt } from "react-icons/bi";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  CreditCard,
  Users,
} from "lucide-react";
import { MdCategory } from "react-icons/md";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    setCollapsed(pathName === "/retailSale" || pathName === "/wholeSale");
  }, [pathName]);

  return (
    <aside
      className={`hidden md:flex ${collapsed ? "w-20" : "w-64"} 
      bg-primary-600 text-white flex-col h-screen sticky top-0 transition-all duration-300`}
    >
      {/* Header with Toggle Button */}
      <div className="flex justify-between items-center px-4 py-6">
        {!collapsed && (
          <motion.div
            className="text-xl font-bold flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CreditCard className="h-6 w-6" />
            <span>ModernPOS</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:text-gray-200 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 px-2">
        <div className="space-y-1">
          <SidebarLink
            to="/"
            icon={<LayoutDashboard />}
            text="Dashboard"
            collapsed={collapsed}
            title="Dashboard"
          />
          <SidebarLink
            to="/categories"
            icon={<MdCategory size={22} />}
            text="Categories"
            collapsed={collapsed}
            title="Categories"
          />
          <SidebarLink
            to="/productes"
            icon={<BiLogoProductHunt size={22} />}
            text="Productes"
            collapsed={collapsed}
            title="Productes"
          />
          <SidebarLink
            to="/retailSale"
            icon={<ShoppingCart />}
            text="Retail Sale"
            collapsed={collapsed}
            title="Retail Sale"
          />
          <SidebarLink
            to="/wholeSale"
            icon={<ShoppingCart />}
            text="Whole Sale"
            collapsed={collapsed}
            title="Whole Sale"
          />
          <SidebarLink
            to="/inventory"
            icon={<Package />}
            text="Inventory"
            collapsed={collapsed}
            title="Inventory"
          />
          <SidebarLink
            to="/transactions"
            icon={<FileText />}
            text="Transactions"
            collapsed={collapsed}
            title="Transactions"
          />
          <SidebarLink
            to="/customers"
            icon={<Users />}
            text="Customers"
            collapsed={collapsed}
            title="Customers"
          />
          <SidebarLink
            to="/settings"
            icon={<Settings />}
            text="Settings"
            collapsed={collapsed}
            title="Settings"
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-700 mt-auto">
        {!collapsed && (
          <div className="text-sm text-primary-200">
            <p>ModernPOS System</p>
            <p>Version 1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
  title: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  text,
  collapsed,
  title
}) => {
  return (
    <NavLink
      to={to}
      title={title}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors
         ${
           isActive
             ? "bg-primary-700 text-white"
             : "text-primary-200 hover:text-white hover:bg-primary-700/50"
         }`
      }
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        {icon}
      </motion.div>
      {!collapsed && <span className="whitespace-nowrap">{text}</span>}
    </NavLink>
  );
};

export default Sidebar;
