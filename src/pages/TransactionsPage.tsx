import {  useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WholeSaleTab from "../components/transaction/WholeSaleTab";
import RetailSaleTab from "../components/transaction/RetailSaleTab";
import AllTransactions from "../components/transaction/AllTransactions";

const tabs = [
  { id: "all", label: "All Transactions" },
  { id: "wholesale", label: "Wholesale Sale" },
  { id: "retail", label: "Retail Sale" },
];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return <AllTransactions/>;
      case "wholesale":
        return <WholeSaleTab />;
      case "retail":
        return <RetailSaleTab />;

      default:
        return null;
    }
  };

 

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
