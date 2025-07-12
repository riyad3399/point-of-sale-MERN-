import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WholeSaleTab from "../components/transaction/WholeSaleTab";
import RetailSaleTab from "../components/transaction/RetailSaleTab";
import AllTransactions from "../components/transaction/AllTransactions";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";

export default function TransactionsPage() {
  const { hasPermission } = usePermission();
  const { t } = useTranslation();

  // Define tabs with visibility based on permissions
  const tabs = [
    {
      id: "all",
      label: t("transactions.all"),
      visible:
        hasPermission("sales", "retailSale", [
          "view",
          "add",
          "edit",
          "delete",
        ]) || hasPermission("sales", "wholeSale", ["view", "edit", "delete"]),
    },
    {
      id: "wholesale",
      label: t("transactions.wholesale"),
      visible: hasPermission("sales", "wholeSale", ["view", "edit", "delete"]),
    },
    {
      id: "retail",
      label: t("transactions.retail"),
      visible: hasPermission("sales", "retailSale", ["view", "edit", "delete"]),
    },
  ];

  // Filter only visible tabs
  const visibleTabs = tabs.filter((tab) => tab.visible);

  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || null);


  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0]?.id || null);
    }
  }, [activeTab, visibleTabs]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return <AllTransactions />;
      case "wholesale":
        return <WholeSaleTab />;
      case "retail":
        return <RetailSaleTab />;
      default:
        return null;
    }
  };

  if (!activeTab) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center text-gray-500">
        {t("transactions.no_access")}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex gap-4 border-b pb-2">
        {visibleTabs.map((tab) => (
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
