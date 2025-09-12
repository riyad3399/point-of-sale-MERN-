import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Users,
  Building2,
  Calendar,
  Hash,
  XCircle,
  Truck,
} from "lucide-react";
import Loading from "../Loading";
import { fetchSupplierDetails } from "../../utils/api";
import ViewSupplierDetailsModal from "./ViewSupplierDetailsModal";
import { Supplier } from "../../types";
import { useTranslation } from "react-i18next";
import { usePermission } from "../../hooks/usePermission";
import { useAuth } from "../../context/AuthContext";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [filterByEmail, setFilterByEmail] = useState(false);
  const [filterByPhone, setFilterByPhone] = useState(false);
  const [filterByAddress, setFilterByAddress] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  // const { hasPermission } = usePermission();

  const { t } = useTranslation();
  const {token} = useAuth()

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/suppliers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        setSuppliers(data.data);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [token]);

  // Memoize filtered and sorted suppliers
  const filteredAndSortedSuppliers = useMemo(() => {
    let currentSuppliers = suppliers;

    // Apply Search Filter
    if (searchTerm) {
      currentSuppliers = currentSuppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.phone?.includes(searchTerm) ||
          supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) // Also include address in search
      );
    }

    // Apply Contact Info Filters
    if (filterByEmail) {
      currentSuppliers = currentSuppliers.filter((supplier) => supplier.email);
    }
    if (filterByPhone) {
      currentSuppliers = currentSuppliers.filter((supplier) => supplier.phone);
    }
    if (filterByAddress) {
      currentSuppliers = currentSuppliers.filter(
        (supplier) => supplier.address
      );
    }

    // Apply Sorting
    currentSuppliers.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0; // Default or fallback
    });

    return currentSuppliers;
  }, [
    suppliers,
    searchTerm,
    filterByEmail,
    filterByPhone,
    filterByAddress,
    sortBy,
  ]);

  // Calculate Stats based on ALL suppliers (not filtered)
  const stats = useMemo(() => {
    const withEmail = suppliers.filter((s) => s.email).length;
    const withPhone = suppliers.filter((s) => s.phone).length;
    const withAddress = suppliers.filter((s) => s.address).length;

    return { total: suppliers.length, withEmail, withPhone, withAddress };
  }, [suppliers]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterByEmail(false);
    setFilterByPhone(false);
    setFilterByAddress(false);
    setSortBy("name");
    setShowFilters(false); // Optionally if you want the panel to close on clear
  };

  // view details
  const handleViewDetails = async (id: string) => {
    const data = await fetchSupplierDetails(id);
    if (data) {
      setSelectedSupplier(data);
      setIsModalOpen(true);
    }
  };

  // --- Loading State ---
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen " >
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <h2 className="text-3xl font-bold text-gray-800  mb-6 text-center md:text-left flex items-center gap-2">
          <Truck className="text-primary-500 h-8 w-8" />{" "}
          {t("supplier.supplierDirectory")}
        </h2>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <motion.div
            variants={cardVariants}
            className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100 "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600  mb-1">
                  {t("supplier.totalSuppliers")}
                </p>
                <p className="text-2xl font-bold  ">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary-100  rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600 " />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100 "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600  mb-1">
                  {t("supplier.withEmail")}
                </p>
                <p className="text-2xl font-bold  ">
                  {stats.withEmail}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100  rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600 " />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100 "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600  mb-1">
                  {t("supplier.withPhone")}
                </p>
                <p className="text-2xl font-bold  ">
                  {stats.withPhone}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100  rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-600 " />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100 "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600  mb-1">
                  {t("supplier.withAddress")}
                </p>
                <p className="text-2xl font-bold  ">
                  {stats.withAddress}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100  rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600 " />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filter Button Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  mb-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              {" "}
              {/* Added w-full */}
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("supplier.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-gray-50  border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500   placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600  transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium w-full sm:w-auto" // Added w-full sm:w-auto
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </motion.div>

        {/* Filter/Sort Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={filterPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100  mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info Filters */}
                <div>
                  <h4 className="font-semibold   mb-3">
                    {t("supplier.contactInfo")}
                  </h4>
                  <label className="flex items-center gap-2 mb-2 text-gray-700 bg-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterByEmail}
                      onChange={(e) => setFilterByEmail(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-primary-600  rounded border-gray-300  focus:ring-primary-500"
                    />
                    {t("supplier.hasEmail")}
                  </label>
                  <label className="flex items-center gap-2 mb-2 text-gray-700 bg-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterByPhone}
                      onChange={(e) => setFilterByPhone(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-primary-600  rounded border-gray-300  focus:ring-primary-500"
                    />
                    {t("supplier.hasPhone")}
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 bg-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterByAddress}
                      onChange={(e) => setFilterByAddress(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-primary-600  rounded border-gray-300  focus:ring-primary-500"
                    />
                    {t("supplier.hasAddress")}
                  </label>
                </div>

                {/* Sort Options */}
                <div>
                  <h4 className="font-semibold   mb-3">
                    {t("supplier.sortBy")}
                  </h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-gray-700 bg-primary cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value="name"
                        checked={sortBy === "name"}
                        onChange={() => setSortBy("name")}
                        className="form-radio h-4 w-4 text-primary-600  border-gray-300  focus:ring-primary-500"
                      />
                      {t("supplier.sortNameAZ")}
                    </label>
                    <label className="flex items-center gap-2 text-gray-700 bg-primary cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value="date"
                        checked={sortBy === "date"}
                        onChange={() => setSortBy("date")}
                        className="form-radio h-4 w-4 text-primary-600  border-gray-300  focus:ring-primary-500"
                      />
                      {t("supplier.sortDateNewest")}
                    </label>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="md:col-span-3 flex justify-end border-t border-gray-100  pt-4 mt-4">
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 text-gray-600  hover:text-gray-800  transition-colors text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    {t("supplier.clearFilters")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supplier Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        ) : filteredAndSortedSuppliers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white  rounded-2xl p-12 text-center shadow-sm border border-gray-100 "
          >
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold   mb-2">
              No suppliers found
            </h3>
            <p className="text-gray-600 ">
              {searchTerm || filterByEmail || filterByPhone || filterByAddress
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first supplier"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredAndSortedSuppliers.map((supplier) => (
                <motion.div
                  key={supplier._id}
                  variants={cardVariants}
                  layout
                  whileHover="hover"
                  className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100  transition-all duration-200 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50  to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold   mb-1">
                          {supplier.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 ">
                          <Calendar className="w-4 h-4" />
                          {new Date(supplier.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500  bg-gray-100  px-2 py-1 rounded-lg">
                        <Hash className="w-3 h-3" />
                        {supplier.supplierId}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100  rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-primary-600 " />
                        </div>
                        <span
                          className={`text-sm ${
                            supplier.phone
                              ? "text-gray-700 bg-primary"
                              : "text-gray-400 italic"
                          }`}
                        >
                          {supplier.phone || "No phone"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100  rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-green-600 " />
                        </div>
                        <span
                          className={`text-sm truncate ${
                            supplier.email
                              ? "text-gray-700 bg-primary"
                              : "text-gray-400 italic"
                          }`}
                        >
                          {supplier.email || "No email"}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100  rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-orange-600 " />
                        </div>
                        <span
                          className={`text-sm line-clamp-2 ${
                            supplier.address
                              ? "text-gray-700 bg-primary"
                              : "text-gray-400 italic"
                          }`}
                        >
                          {supplier.address || "No address provided"}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 ">
                      <div className="flex items-center gap-2">
                        {supplier.email && (
                          <div
                            className="w-2 h-2 bg-green-500 rounded-full"
                            title="Has email"
                          ></div>
                        )}
                        {supplier.phone && (
                          <div
                            className="w-2 h-2 bg-primary-500 rounded-full"
                            title="Has phone"
                          ></div>
                        )}
                        {supplier.address && (
                          <div
                            className="w-2 h-2 bg-orange-500 rounded-full"
                            title="Has address"
                          ></div>
                        )}
                        {!supplier.email &&
                          !supplier.phone &&
                          !supplier.address && (
                            <span className="text-xs text-gray-400 italic">
                              {t("supplier.noSuppliersFound")}
                            </span>
                          )}
                      </div>
                      <button
                        onClick={() => handleViewDetails(supplier._id)}
                        className="text-xs text-primary-600  hover:underline"
                      >
                        {t("supplier.viewDetails")}
                      </button>
                    </div>
                  </div>{" "}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <ViewSupplierDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={selectedSupplier}
      />
    </div>
  );
};

export default SupplierList;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }, 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    y: -5, 
    boxShadow: "0 8px 15px rgba(0,0,0,0.08)", 
    transition: { duration: 0.2 },
  },
};

const filterPanelVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
