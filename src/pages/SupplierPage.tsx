import { useState } from "react";
import { motion } from "framer-motion";
import SupplierAddForm from "../components/supplier/SupplierAddForm";
import SupplierList from "../components/supplier/SupplierList";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";

export default function SupplierPage() {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  const canAdd = hasPermission("supplier", "supplier", ["add"]);
  const canView = hasPermission("supplier", "supplier", ["view"]);

  // Default tab based on what the user can access
  const [activeTab, setActiveTab] = useState<"form" | "list">(
    canView ? "list" : "form"
  );

  const availableTabs = [
    canAdd && { key: "form", label: t("supplier.addSupplier") },
    canView && { key: "list", label: t("supplier.supplierList") },
  ].filter(Boolean) as { key: "form" | "list"; label: string }[];

  return (
    <div className="min-w-full bg-gray-50">
      {availableTabs.length > 0 && (
        <div
          role="tablist"
          aria-label="Products tabs"
          className="relative flex justify-start border-b border-gray-300 bg-gray-50"
        >
          {availableTabs.map((tab) => {
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
      

      <div className="bg-gray-50 border-l border-r border-b min-h-[300px]">
        <div className="">
          {activeTab === "form" && canAdd && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              <SupplierAddForm />
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
              <SupplierList />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
