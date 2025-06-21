import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SupplierAddForm from "../components/supplier/SupplierAddForm";
import SupplierList from "../components/supplier/SupplierList";
import { useTranslation } from "react-i18next";



export default function SupplierPage() {
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");

  const { t } = useTranslation();

  const tabs = [
    { key: "form", label: t("supplier.addSupplier") },
    { key: "list", label: t("supplier.supplierList") },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50">
      {/* Smart Tab Header */}
      <div className="relative flex border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "form" | "list")}
            className={`relative w-full px-4 py-3 text-center font-medium transition-colors duration-300 ${
              activeTab === tab.key
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 rounded-xl shadow-md min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "form" ? (
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
          ) : (
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
        </AnimatePresence>
      </div>
    </div>
  );
}
