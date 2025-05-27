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
  ClipboardList,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { MdCategory } from "react-icons/md";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);

  useEffect(() => {
    setCollapsed(pathName === "/retailSale" || pathName === "/wholeSale");

    // Auto open dropdown if under /report
    if (pathName.startsWith("/report")) {
      setReportOpen(true);
    } else {
      setReportOpen(false)
      
    }
  }, [pathName]);

  return (
    <aside
      className={`hidden md:flex ${collapsed ? "w-20" : "w-64"} 
      bg-primary-600 text-white flex-col h-screen sticky top-0 transition-all duration-300 overflow-y-auto `}
    >
      {/* Header */}
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
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
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

          {/* Dropdown for Report */}
          <button
            onClick={() => setReportOpen(!reportOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors
              ${
                pathName.startsWith("/report")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
          >
            <ScrollText />
            {!collapsed && (
              <span className="flex-1 text-left whitespace-nowrap">Report</span>
            )}
            {!collapsed && (
              <motion.div animate={{ rotate: reportOpen ? 90 : 0 }}>
                <ChevronRight size={16} />
              </motion.div>
            )}
          </button>

          {/* Dropdown Items */}
          {reportOpen && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <SidebarLink
                to="/reportStatement"
                icon={<ClipboardList size={16} />}
                text="Statement"
                collapsed={collapsed}
                title="Statement"
              />
              <SidebarLink
                to="/alertItems"
                icon={<AlertCircle size={16} />}
                text="Alert Items"
                collapsed={collapsed}
                title="Alert Items"
              />
            </motion.div>
          )}

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
  title,
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
