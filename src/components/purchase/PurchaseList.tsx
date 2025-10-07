import { useEffect, useState, useMemo } from "react";
import {
  Package,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  X,
} from "lucide-react";
import axios from "axios";
import Loading from "../Loading";
import StatCard from "../helper/StatCard";
import FilterDropdown from "../helper/FilterDropdown";
import { Purchase } from "../../types";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { usePermission } from "../../hooks/usePermission";
import PurchaseTable from "../helper/PurchaseTable";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

type PaymentStatus = "all" | "paid" | "due";
type DateFilter = "all" | "today" | "week" | "month" | "custom";

export default function PurchaseList() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
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
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;
  const { hasPermission } = usePermission();

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 300));
        const res = await axios.get(`${BASE_URL}/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Purchase[] = res.data?.data ?? res.data ?? [];
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token, BASE_URL]);

  const paymentMethods = useMemo(() => {
    const methods = new Set(purchases.map((p) => p.paymentMethod ?? "Unknown"));
    return Array.from(methods);
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return purchases.filter((purchase) => {
      // search
      const matchesSearch =
        !q ||
        (purchase.supplier?.name ?? "").toLowerCase().includes(q) ||
        purchase.items.some((it) =>
          String(it.product ?? "")
            .toLowerCase()
            .includes(q)
        );

      const matchesPaymentStatus =
        paymentStatus === "all" ||
        (paymentStatus === "paid" && purchase.due === 0) ||
        (paymentStatus === "due" && purchase.due > 0);

      const matchesPaymentMethod =
        paymentMethodFilter === "all" ||
        purchase.paymentMethod === paymentMethodFilter;

      const purchaseDate = new Date(purchase.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let matchesDate = true;
      switch (dateFilter) {
        case "today":
          matchesDate = purchaseDate.toDateString() === today.toDateString();
          break;
        case "week": {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          matchesDate = purchaseDate >= weekAgo;
          break;
        }
        case "month": {
          const monthAgo = new Date(today);
          monthAgo.setDate(today.getDate() - 30);
          matchesDate = purchaseDate >= monthAgo;
          break;
        }
        case "custom": {
          const start = customDateRange.start
            ? new Date(customDateRange.start)
            : null;
          const end = customDateRange.end
            ? new Date(customDateRange.end)
            : null;
          if (start && end)
            matchesDate = purchaseDate >= start && purchaseDate <= end;
          else if (start) matchesDate = purchaseDate >= start;
          else if (end) matchesDate = purchaseDate <= end;
          break;
        }
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

  const stats = useMemo(() => {
    const total = filteredPurchases.reduce((s, p) => s + (p.total ?? 0), 0);
    const paid = filteredPurchases.reduce((s, p) => s + (p.paid ?? 0), 0);
    const due = filteredPurchases.reduce((s, p) => s + (p.due ?? 0), 0);
    return { count: filteredPurchases.length, total, paid, due };
  }, [filteredPurchases]);

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

  const handleDelete = async (id: string) => {
    if (!hasPermission("purchase", "purchase", ["delete"])) {
      toast.error("You don't have permission to delete.");
      return;
    }
    if (!confirm("Are you sure you want to delete this purchase?")) return;

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/purchases/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen font-sans">
      <Helmet>
        <title>Purchase List | POS System</title>
      </Helmet>

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

      {/* Search & Filters */}
      <div className="bg-white rounded-xl  p-5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("purchase.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "bg-primary-600 text-white"
                : "bg-primary-500 text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>
              {showFilters
                ? t("purchase.hideFilters")
                : t("purchase.showFilters")}
            </span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-danger-500 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-slate-100 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                ...paymentMethods.map((m) => ({ value: m, label: m })),
              ]}
            />

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
        )}

        {dateFilter === "custom" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) =>
                  setCustomDateRange((s) => ({ ...s, start: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
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
                  setCustomDateRange((s) => ({ ...s, end: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}
      {filteredPurchases.length > 0 ? (
        <div>
          <PurchaseTable
            purchases={filteredPurchases}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
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
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm"
            >
              {" "}
              {t("purchase.clearFilters")}{" "}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
