import { useState } from "react";
import AddExpense from "../components/expense/AddExpense";
import ExpenseList from "../components/expense/ExpenseList";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const tabs = [
  { key: "add", label: "খরচ যোগ করুন" },
  { key: "list", label: "খরচের তালিকা" },
];

export default function ExpensePage() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-md">
      <Helmet>
        <title>Expense | POS System</title>
      </Helmet>
      {/* Smart Tab Header */}
      <div className="relative flex border-b">
        {tabs.map((tab) => (
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

      {/* Animated Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {activeTab === "add" && <AddExpense />}
        {activeTab === "list" && <ExpenseList />}
      </motion.div>
    </div>
  );
}
