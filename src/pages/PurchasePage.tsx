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
    <div className="max-w-full">
      {tabs.length > 0 && (
        <div
          role="tablist"
          aria-label="Products tabs"
          className="relative flex justify-start border-b border-gray-300 bg-gray-50"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                title={tab.label}
                onClick={() => {
                  setActiveTab(tab.key);
                }}
                className={`relative px-5 py-2 text-sm font-medium transition-all duration-200
          ${
            isActive
              ? "bg-white text-primary-700 -mb-[1px] border border-gray-300 border-b-white rounded-t-md shadow-sm"
              : "text-gray-500 hover:text-primary-500"
          }
        `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {hasPermission("purchase", "purchase", ["trigger"]) && (
        <div className="  min-h-[300px]">
          <div className="">
            {activeTab === "form" && canAdd && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border-r border-l border-b rounded-b-md"
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
                className=""
              >
                <PurchaseList />
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
