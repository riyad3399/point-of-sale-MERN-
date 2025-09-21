import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  AlertCircle,
  Package,
  TrendingUp,
  CheckCircle,
  Wallet,
  Receipt,
  Search,
  Filter,
  X,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import Loading from "../Loading";
import StatCard from "../helper/StatCard";
import FilterDropdown from "../helper/FilterDropdown";
import { Purchase } from "../../types";
import PurchaseCard from "../helper/PurchaseCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";


type PaymentStatus = "all" | "paid" | "due";
type DateFilter = "all" | "today" | "week" | "month" | "custom";

export default function PurchaseList() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const { t } = useTranslation();
  const { token } = useAuth()
  const BASE_URL = import.meta.env.VITE_BASE_URI;


  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = await axios.get(`${BASE_URL}/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedData = res.data.data.sort(
          (a: Purchase, b: Purchase) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPurchases(sortedData);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [token]);

  // Get unique payment methods for the filter dropdown
  const paymentMethods = useMemo(() => {
    const methods = new Set(purchases.map((p) => p.paymentMethod));
    return Array.from(methods);
  }, [purchases]);

  // Core filtering logic
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      // 1. Search filter (supplier.name or product id string)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        purchase.supplier?.name?.toLowerCase().includes(searchLower) ||
        purchase.items.some((item) =>
          item.product?.toString().toLowerCase().includes(searchLower)
        );

      // 2. Payment status filter
      const matchesPaymentStatus =
        paymentStatus === "all" ||
        (paymentStatus === "paid" && purchase.due === 0) ||
        (paymentStatus === "due" && purchase.due > 0);

      // 3. Payment method filter
      const matchesPaymentMethod =
        paymentMethodFilter === "all" ||
        purchase.paymentMethod === paymentMethodFilter;

      // 4. Date filter
      const purchaseDate = new Date(purchase.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let matchesDate = true;

      switch (dateFilter) {
        case "today":
          matchesDate = purchaseDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          matchesDate = purchaseDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setDate(today.getDate() - 30);
          matchesDate = purchaseDate >= monthAgo;
          break;
        case "custom":
          const start = customDateRange.start
            ? new Date(customDateRange.start)
            : null;
          const end = customDateRange.end
            ? new Date(customDateRange.end)
            : null;
          if (start && end) {
            matchesDate = purchaseDate >= start && purchaseDate <= end;
          } else if (start) {
            matchesDate = purchaseDate >= start;
          } else if (end) {
            matchesDate = purchaseDate <= end;
          }
          break;
      }

      return (
        matchesSearch &&
        matchesPaymentStatus &&
        matchesPaymentMethod &&
        matchesDate
      );
    });
  }, [
    purchases,
    searchQuery,
    paymentStatus,
    paymentMethodFilter,
    dateFilter,
    customDateRange,
  ]);
  
  

  // Calculate statistics based on FILTERED purchases
  const stats = useMemo(() => {
    const total = filteredPurchases.reduce((sum, p) => sum + p.total, 0);
    const paid = filteredPurchases.reduce((sum, p) => sum + p.paid, 0);
    const due = filteredPurchases.reduce((sum, p) => sum + p.due, 0);
    return { count: filteredPurchases.length, total, paid, due };
  }, [filteredPurchases]);

  // --- Helper Functions ---
  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return <Wallet className="w-4 h-4 text-green-500" />;
      case "card":
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      default:
        return <Receipt className="w-4 h-4 text-slate-500" />;
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPaymentStatus("all");
    setDateFilter("all");
    setPaymentMethodFilter("all");
    setCustomDateRange({ start: "", end: "" });
  };

  const activeFiltersCount = [
    searchQuery !== "",
    paymentStatus !== "all",
    dateFilter !== "all",
    paymentMethodFilter !== "all",
  ].filter(Boolean).length;

  // --- Loading State ---
  if (loading) {
    return <Loading />;
  }

  // --- Render ---
  return (
    <div className=" min-h-screen font-sans">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {t("purchase.listTitle")}
            </h1>
            <p className="text-slate-500 mt-1">{t("purchase.subtitle")}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={t("purchase.totalPurchases")}
          value={stats.count}
          icon={<TrendingUp />}
          color="indigo"
        />
        <StatCard
          title={t("purchase.totalAmount")}
          value={`৳${stats.total.toLocaleString()}`}
          icon={<DollarSign />}
          color="blue"
        />
        <StatCard
          title={t("purchase.amountPaid")}
          value={`৳${stats.paid.toLocaleString()}`}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title={t("purchase.amountDue")}
          value={`৳${stats.due.toLocaleString()}`}
          icon={<AlertCircle />}
          color="red"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("purchase.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            } relative`}
          >
            <Filter className="w-4 h-4" />
            <span>
              {showFilters
                ? t("purchase.hideFilters")
                : t("purchase.showFilters")}
            </span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                {activeFiltersCount}
              </span>
            )}
          </motion.button>

          {activeFiltersCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4 border-t border-slate-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Payment Status Filter */}
                <FilterDropdown
                  label={t("purchase.paymentStatus")}
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as PaymentStatus)
                  }
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "paid", label: "Fully Paid" },
                    { value: "due", label: "Has Due" },
                  ]}
                />

                <FilterDropdown
                  label={t("purchase.paymentMethod")}
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Methods" },
                    ...paymentMethods.map((method) => ({
                      value: method,
                      label: method,
                    })),
                  ]}
                />

                {/* Date Filter */}
                <FilterDropdown
                  label={t("purchase.dateRange")}
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  options={[
                    { value: "all", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "Last 7 Days" },
                    { value: "month", label: "Last 30 Days" },
                    { value: "custom", label: "Custom Range" },
                  ]}
                />
              </div>

              <AnimatePresence>
                {dateFilter === "custom" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) =>
                          setCustomDateRange((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) =>
                          setCustomDateRange((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredPurchases.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredPurchases.slice(0, 10).map((purchase) => (
            <PurchaseCard
              key={purchase._id}
              purchase={purchase}
              isExpanded={expandedId === purchase._id}
              toggleExpand={toggleExpand}
              getPaymentIcon={getPaymentIcon}
              variants={itemVariants}
            />
          ))}
        </motion.div>
      ) : (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white rounded-xl shadow-lg"
        >
          <Package className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            {t("purchase.noPurchasesFound")}
          </h3>
          <p className="text-slate-500">
            {activeFiltersCount > 0
              ? "Try adjusting your search or filters."
              : "You haven't made any purchases yet."}
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
            >
              {t("purchase.clearFilters")}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
    },
  },
};
