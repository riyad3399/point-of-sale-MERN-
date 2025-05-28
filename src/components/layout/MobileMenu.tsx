// components/MobileMenu.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Settings,
  Users,
  ScrollText,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { MdCategory } from "react-icons/md";
import { BiLogoProductHunt } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const menuLinks = [
    { to: "/", text: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/categories", text: "Categories", icon: <MdCategory size={24} /> },
    {
      to: "/productes",
      text: "Productes",
      icon: <BiLogoProductHunt size={22} />,
    },
    { to: "/retailSale", text: "Retail Sale", icon: <ShoppingCart /> },
    { to: "/wholeSale", text: "Whole Sale", icon: <ShoppingCart /> },
    { to: "/transactions", text: "Transactions", icon: <FileText /> },
    { to: "/customers", text: "Customers", icon: <Users /> },
    { to: "/reportStatement", text: "Statement", icon: <ScrollText /> },
    { to: "/alertItems", text: "Alert Items", icon: <AlertCircle /> },
    { to: "/settings", text: "Settings", icon: <Settings /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-fit h-full bg-primary-700 text-white z-[9999] shadow-lg flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary-500">
            <div className="text-sm font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              ModernPOS
            </div>
            <button onClick={onClose} className="text-white text-2xl">
              &times;
            </button>
          </div>

          <nav className="flex-1 px-4 py-3 space-y-2">
            {menuLinks.map((link) => (
              <NavLink
                to={link.to}
                key={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition 
                  ${
                    isActive
                      ? "bg-primary-900 text-white"
                      : "text-primary-100 hover:bg-primary-600"
                  }`
                }
              >
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
