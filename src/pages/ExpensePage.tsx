import { useState } from "react";
import AddExpense from "../components/expense/AddExpense";
import ExpenseList from "../components/expense/ExpenseList";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";

export default function ExpensePage() {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  const canAdd = hasPermission("expense", "expense", ["add"]);
  const canView = hasPermission("expense", "expense", ["view"]);

  const availableTabs = [
    canAdd && { key: "add", label: t("expense.addExpense") },
    canView && { key: "list", label: t("expense.expenseList") },
  ].filter(Boolean) as { key: "add" | "list"; label: string }[];

  const [activeTab, setActiveTab] = useState<"add" | "list">(
    canView ? "list" : "add"
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-md">
      <Helmet>
        <title>Expense | POS System</title>
      </Helmet>

      {/* Smart Tab Header */}
      {availableTabs.length > 0 && (
        <div className="relative flex border-b">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative w-full px-4 py-3 text-center font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Animated Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {activeTab === "add" && canAdd && <AddExpense />}
        {activeTab === "list" && canView && <ExpenseList />}
      </motion.div>
    </div>
  );
}
