import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CreditCard,
  List,
  Tag,
  DollarSign,
  Search,
  XCircle,
  Layers,
  PiggyBank,
  Trash2,
  Edit,
  FileText,
  BarChart2,
  Wallet,
} from "lucide-react";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import UpdateExpenseModal from "./UpdateExpenseModal";
import { deleteExpense } from "../../utils/api";
import Swal from "sweetalert2";
import { Expense, Item } from "../../types";
import { useTranslation } from "react-i18next";
import { usePermission } from "../../hooks/usePermission";




// Helper functions
const calculateExpenseTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getMethodColor = (method: string) => {
  const colors = {
    CASH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    BKASH: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    BANK: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };
  return colors[method as keyof typeof colors] || colors.default;
};

export default function ExpenseList() {
  // State management
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {hasPermission} =usePermission()

  const { t } = useTranslation();

  // Fetch expenses
  const fetchAllExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/expenses");
      setAllExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setAllExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return allExpenses
      .filter((expense) => !dateFilter || expense.date === dateFilter)
      .filter((expense) => !methodFilter || expense.method === methodFilter)
      .filter((expense) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          expense.method.toLowerCase().includes(lowerSearchTerm) ||
          expense.date.includes(lowerSearchTerm) ||
          expense.items.some(
            (item) =>
              item.category.toLowerCase().includes(lowerSearchTerm) ||
              item.remarks?.toLowerCase().includes(lowerSearchTerm)
          )
        );
      });
  }, [allExpenses, dateFilter, methodFilter, searchTerm]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalEntries = filteredExpenses.length;
    const totalAmount = filteredExpenses.reduce(
      (sum, expense) => sum + calculateExpenseTotal(expense.items),
      0
    );
    const uniqueMethods = new Set(filteredExpenses.map((e) => e.method)).size;
    const categories = new Set(
      filteredExpenses.flatMap((expense) =>
        expense.items.map((item) => item.category)
      )
    ).size;

    return { totalEntries, totalAmount, uniqueMethods, categories };
  }, [filteredExpenses]);

  // Clear filters
  const handleClearFilters = () => {
    setDateFilter("");
    setMethodFilter("");
    setSearchTerm("");
  };

  // Delete expense (placeholder)
  const handleDeleteExpense = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteExpense(id);
        Swal.fire("Deleted!", "Expense has been deleted.", "success");
        fetchAllExpenses(); // or update local state
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error", "Failed to delete expense.", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  // Edit expense (placeholder)
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Wallet className="text-blue-600 dark:text-blue-400 h-8 w-8" />
            {t("expense.title")}
          </h1>
          <div>
            <button className="flex items-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md">
              <BarChart2 size={18} />
              <Link to="/report"> {t("expense.reports")}</Link>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("expense.totalEntries")}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalEntries}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("expense.totalAmount")}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("expense.paymentMethods")}
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.uniqueMethods}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("expense.categories")}
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.categories}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("expense.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <div className="relative">
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48 appearance-none"
                >
                  <option value="">All Methods</option>
                  <option value="CASH">Cash</option>
                  <option value="BKASH">Bkash</option>
                  <option value="BANK">Bank</option>
                </select>
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl transition-colors"
              >
                <XCircle className="w-4 h-4" />
                {t("expense.clear")}
              </button>
            </div>
          </div>
        </div>

        {/* Expense List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.slice(0, 10).map((expense) => (
              <motion.div
                key={expense._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {formatDate(expense.date)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {expense.items.length} {t("expense.items")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(
                          expense.method
                        )}`}
                      >
                        {expense.method}
                      </div>
                      {hasPermission("expense", "expense", ["edit"]) && (
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {hasPermission("expense", "expense", ["delete"]) && <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <DollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("expense.totalAmount")}
                        </p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(calculateExpenseTotal(expense.items))}
                        </p>
                      </div>
                    </div>
                    <button className="hidden text-sm text-blue-600 dark:text-blue-400 hover:underline  items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {t("expense.viewDetails")}
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {expense.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 lg:grid-cols-3 justify-center items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {item.category}
                          </span>
                        </div>
                        <div className=" items-center gap-2 text-gray-600 dark:text-gray-400 hidden sm:flex">
                          <List className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {item.remarks || "No remarks"}
                          </span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t("expense.unitPrice")}
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t("expense.quantity")}
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t("expense.total")}
                            </p>
                            <p className="font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {selectedExpense && (
        <UpdateExpenseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          expense={selectedExpense}
          onUpdated={() => {
            fetchAllExpenses(); // data refetch korte chaile
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    y: -8,
    boxShadow: "0 15px 25px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 },
  },
};
