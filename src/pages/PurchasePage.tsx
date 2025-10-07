import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PurchaseForm from "../components/purchase/AddPurchase";
import PurchaseList from "../components/purchase/PurchaseList";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";

export default function PurchasePage() {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  const canAdd = hasPermission("purchase", "purchase", ["add"]);
  const canView = hasPermission("purchase", "purchase", ["view"]);

  const defaultTab = canAdd ? "form" : "list"; 

  const [activeTab, setActiveTab] = useState<"form" | "list">(
    defaultTab as "form" | "list"
  );

  const tabs = [
    canAdd && { key: "form", label: t("purchase.addPurchase") },
    canView && { key: "list", label: t("purchase.purchaseList") },
  ].filter(Boolean) as { key: "form" | "list"; label: string }[];

  return (
    <div className="max-w-7xl mx-auto">
      {tabs.length > 0 && (
        <div className="relative flex border-b border-gray-300 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative w-full px-4 py-3 text-center font-medium transition-colors duration-300 ${
                activeTab === tab.key
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-primary-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {hasPermission("purchase", "purchase",["trigger"]) && (
        <div className="  min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === "form" && canAdd && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                <PurchaseForm />
              </motion.div>
            )}

            {activeTab === "list" && canView && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                <PurchaseList />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
