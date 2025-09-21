import React from "react";
import { motion } from "framer-motion";
import { Store, Upload } from "lucide-react";
import StoreInformation from "../components/setting/StoreInformation";
import UploadCsvFile from "../components/setting/UploadCsvFile";
import { Helmet } from "react-helmet-async";
import LanguageSwitcher from "../components/LanguageSwitcher";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("store");

  return (
    <div>
      <Helmet>
        <title>Settings | POS System</title>
      </Helmet>
      <div className="flex lg:justify-between">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <div className="p-3">
              <SettingNavItem
                icon={<Store />}
                title="Store Information"
                isActive={activeTab === "store"}
                onClick={() => setActiveTab("store")}
              />
              {/* <SettingNavItem
                icon={<Receipt />}
                title="Receipt Settings"
                isActive={activeTab === "receipt"}
                onClick={() => setActiveTab("receipt")}
              /> */}
              <SettingNavItem
                icon={<Upload />}
                title="Upload Products"
                isActive={activeTab === "upload"}
                onClick={() => setActiveTab("upload")}
              />
            </div>
          </div>
        </div>

        {/* Settings Content */}
        {activeTab === "store" && (
          <div className="lg:col-span-3">
            <StoreInformation />
          </div>
        )}
        {activeTab === "upload" && (
          <div className="lg:col-span-3 flex items-center justify-center">
            <UploadCsvFile />
          </div>
        )}
      </div>
    </div>
  );
};

interface SettingNavItemProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SettingNavItem: React.FC<SettingNavItemProps> = ({
  icon,
  title,
  isActive,
  onClick,
}) => {
  return (
    <motion.div
      className={`flex items-center gap-3 p-3 rounded-md mb-1 cursor-pointer ${
        isActive
          ? "bg-primary-50 text-primary-700"
          : "text-gray-700 hover:bg-gray-50"
      }`}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </motion.div>
  );
};

export default SettingsPage;
