import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Bell, MessageSquare, User } from "lucide-react";
import axios from "axios";
import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "../LanguageSwitcher";
import LogoutButton from "../LogoutButton";
import { getHandleProfile } from "../../utils/api";

type SmsBalanceType = {
  response_code: number;
  balance: number;
};

const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [smsBalance, setSmsBalance] = useState<SmsBalanceType>();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState({});

  const token = localStorage.getItem("token");

  const fetchLowStockItems = async () => {
    try {
      const res = await axios.get("http://localhost:3000/product/low-stock");
      const data = res.data;
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchSmsBalance = async () => {
    try {
      const res = await axios.get(
        "http://bulksmsbd.net/api/getBalanceApi?api_key=ElME4aE1aEqIie8cGz97"
      );
      const data = res.data;

      setSmsBalance(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLowStockItems();
    fetchSmsBalance();
    const interval = setInterval(fetchLowStockItems, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getHandleProfile(token, setUser);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 md:px-6 py-3 flex items-center md:justify-end justify-between">
        <div className="mr-10">
          <LanguageSwitcher />
        </div>
        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            className="btn-outline btn-sm mr-2"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <MobileMenu
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center btn-outline btn-sm relative">
            <span>
              <MessageSquare className="h-5 w-5" />
            </span>{" "}
            <span className="absolute -top-2 -left-5 h-5 w-8 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center">
              {smsBalance?.balance ? (smsBalance.balance / 0.35).toFixed(0) : 0}
            </span>
          </div>

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
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 overflow-hidden">
                <User/>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.userName}</p>
                <p className="text-xs text-gray-500 capitalize">Role</p>
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
                {token && <LogoutButton />}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
