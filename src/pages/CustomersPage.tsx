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
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

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
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchGetAllCustomers = async () => {
      try {
        setLoading(true);
        if (canView) {
          const res = await axios.get(`${BASE_URL}/customer`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.status === 200) {
            setCustomers(res.data);
            setCurrentPage(1);
          }
        }
      } catch (error) {
        toast.error(error?.message ?? "something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchGetAllCustomers();
  }, [activeTab, BASE_URL, canView, token]);

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
    <div className="w-full mx-auto bg-gray-50 rounded-sm overflow-hidden">
      <Helmet>
        <title>Show Customers | POS System</title>
      </Helmet>
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
                  setCurrentPage(1);
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

      {loading && <Loading />}

      <div className="bg-gray-50 min-h-full ">
        <div>
          {activeTab === "list" && canView && (
            <div key="list" className="border-l border-r">
              <div className=" relative w-full max-w-md p-6 ">
                <Search
                  className="absolute left-8 top-9 text-gray-400"
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
            </div>
          )}

          {activeTab === "add" && canAdd && (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="p-6 border-b border-l border-r"
            >
              <AddCustomer />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
