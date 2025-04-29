import React from 'react';
import { motion } from 'framer-motion';
import { Save, Store, Receipt, CreditCard, Users, BellRing } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <div className="p-3">
              <SettingNavItem icon={<Store />} title="Store Information" isActive />
              <SettingNavItem icon={<Receipt />} title="Receipt Settings" />
              <SettingNavItem icon={<CreditCard />} title="Payment Methods" />
              <SettingNavItem icon={<Users />} title="User Management" />
              <SettingNavItem icon={<BellRing />} title="Notifications" />
            </div>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Store Information</h2>
            <p className="text-gray-600 mb-6">Manage your store details and business information</p>
            
            <form>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      className="input"
                      defaultValue="Modern Café"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="input"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="input"
                    defaultValue="123 Main Street"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="input"
                      defaultValue="San Francisco"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      className="input"
                      defaultValue="California"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      className="input"
                      defaultValue="94103"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input"
                    defaultValue="info@moderncafe.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    className="input"
                    defaultValue="7"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select id="currency" className="input">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      className="btn-outline"
                    >
                      Upload Image
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 300x100px. Max file size: 1MB.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <motion.button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SettingNavItemProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

const SettingNavItem: React.FC<SettingNavItemProps> = ({ icon, title, isActive }) => {
  return (
    <motion.div
      className={`flex items-center gap-3 p-3 rounded-md mb-1 cursor-pointer ${
        isActive 
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </motion.div>
  );
};

export default SettingsPage;