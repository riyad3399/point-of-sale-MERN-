import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCustomer from "../components/customer/AddCustomer";
import ShowCustomerList from "../components/customer/ShowCustomerList";
import axios from "axios";
import { Box, Search } from "lucide-react";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";
import { useAuth } from "../context/AuthContext";

interface Customer {
  customerId: number;
  customerName: string;
  phone: string;
  address?: string;
}

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function CustomerTabs() {
  const { hasPermission } = usePermission();
  const { t } = useTranslation();

  const canView = hasPermission("customers", "customers", ["view"]);
  const canAdd = hasPermission("customers", "customers", ["add"]);

  const defaultTab = canView ? "list" : "add";
  const [activeTab, setActiveTab] = useState<"list" | "add">(defaultTab);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const { token } = useAuth()
  const BASE_URL = import.meta.env.VITE_BASE_URI;


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (canView) {
      axios
        .get(`${BASE_URL}/customer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCustomers(res.data);
          setCurrentPage(1);
        });
    }
  }, [activeTab]);

  const searchLower = search.toLowerCase();

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.customerName?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower) ||
      (customer.customerId + "").includes(searchLower)
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const availableTabs = [
    canView && { key: "list", label: t("customers.title") },
    canAdd && { key: "add", label: t("customers.addCustomer") },
  ].filter(Boolean) as { key: "list" | "add"; label: string }[];

  return (
    <div className="w-full mx-auto bg-white rounded-2xl overflow-hidden">
      {/* Tab Header */}
      {availableTabs.length > 0 && (
        <div className="flex justify-center border-b bg-gray-50">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-1/2 py-4 font-semibold transition duration-300 ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-4 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Animated Tab Content */}
      <div className="p-6 bg-white min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "list" && canView && (
            <motion.div
              key="list"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="card md:overflow-hidden overflow-x-auto"
            >
              <div className="relative w-full max-w-md mb-6 mt-2 ml-2">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("customers.searchPlaceholder")}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg input bg-white"
                />
              </div>

              <table className="w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">{t("customers.name")}</th>
                    <th className="p-2 border">{t("customers.phone")}</th>
                    <th className="p-2 border">{t("customers.address")}</th>
                    <th className="p-2 border">{t("customers.action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map((customer, idx) => (
                    <ShowCustomerList
                      customer={customer}
                      setCustomers={setCustomers}
                      key={idx}
                      index={indexOfFirst + idx + 1}
                    />
                  ))}
                </tbody>
              </table>

              {filteredCustomers.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>{t("customers.noCustomers")}</p>
                </div>
              )}

              {filteredCustomers.length > itemsPerPage && (
                <div className="flex justify-end mt-4">
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    pageSize={itemsPerPage}
                    currentTransactions={currentCustomers}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    setPage={setCurrentPage}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "add" && canAdd && (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <AddCustomer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
