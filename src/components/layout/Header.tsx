import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import axios from "axios";

const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

 
  const fetchLowStockItems = async () => {
    try {
      const res = await axios.get("http://localhost:3000/product/low-stock");
      const data = res.data;
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchLowStockItems();
    const interval = setInterval(fetchLowStockItems, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 md:px-6 py-3 flex items-center justify-end">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="btn-outline btn-sm mr-2">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              className="btn-outline btn-sm relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {products.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                  {products.length}
                </span>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <motion.div
                className="absolute -left-[133px] top-[37px] mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 h-80 overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="py-2">
                  {products.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-500">
                      কোনো পণ্যের স্টক কম নয়।
                    </p>
                  ) : (
                    products.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm text-red-700 hover:bg-red-50 border-b last:border-b-0"
                      >
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-600">
                          কোড:{" "}
                          <span className="font-mono">{item.productCode}</span>
                        </p>
                        <p className="text-xs">
                          স্টক:{" "}
                          <span className="font-semibold">{item.quantity}</span>{" "}
                          টি বাকি
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              className="flex items-center gap-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img src="" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">use name</p>
                <p className="text-xs text-gray-500 capitalize">role</p>
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
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
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
