import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WholeSaleTab from "../components/transaction/WholeSaleTab";
import RetailSaleTab from "../components/transaction/RetailSaleTab";
import AllTransactions from "../components/transaction/AllTransactions";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const { user } = useAuth();

  function capitalizeFirstLetter(string: string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const retailSalePermission = user?.permissions?.sales?.retailSale || {};
  const wholeSalePermission = user?.permissions?.sales?.wholeSale || {};

  const retailKeys = {};
  const wholeKeys = {};

  const keys1 = new Set([...Object.keys(retailSalePermission)]);
  const keys2 = new Set([...Object.keys(wholeSalePermission)]);

  keys1.forEach((key) => {
    retailKeys[key] = Boolean(retailSalePermission[key]);
  });
  keys2.forEach((key) => {
    wholeKeys[key] = Boolean(wholeSalePermission[key]);
  });

  console.log(retailKeys, wholeKeys);

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return (
          (retailKeys.view ||
            retailKeys.delete ||
            retailKeys.edit ||
            retailKeys.add ||
            wholeKeys.view ||
            wholeKeys.delete ||
            wholeKeys.edit ||
            wholeKeys.add) && (
            <AllTransactions capitalizeFirstLetter={capitalizeFirstLetter} />
          )
        );
      case "wholesale":
        return (
          (wholeKeys.view ||
            wholeKeys.delete ||
            wholeKeys.edit ||
            wholeKeys.add) && (
            <WholeSaleTab capitalizeFirstLetter={capitalizeFirstLetter} />
          )
        );
      case "retail":
        return (
          (retailKeys.view ||
            retailKeys.delete ||
            retailKeys.edit ||
            retailKeys.add) && (
            <RetailSaleTab capitalizeFirstLetter={capitalizeFirstLetter} />
          )
        );

      default:
        return null;
    }
  };

  const { t } = useTranslation();

  const tabs = [
    { id: "all", label: t("transactions.all") },
    { id: "wholesale", label: t("transactions.wholesale") },
    { id: "retail", label: t("transactions.retail") },
  ];
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex gap-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-md font-medium transition-all ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-blue-600"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
