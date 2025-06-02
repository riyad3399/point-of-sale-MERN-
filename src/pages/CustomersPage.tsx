import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCustomer from "../components/customer/AddCustomer";
import ShowCustomerList from "../components/customer/ShowCustomerList";
import axios from "axios";
import { Box, Search } from "lucide-react";
import Pagination from "../components/Pagination";

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
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("http://localhost:3000/customer").then((res) => {
      setCustomers(res.data);
      setCurrentPage(1); // Reset to first page when data changes
    });
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

  return (
    <div className="w-full mx-auto mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Tab Header */}
      <div className="flex justify-center border-b bg-gray-50">
        {["list", "add"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "list" | "add")}
            className={`w-1/2 py-4 font-semibold transition duration-300 ${
              activeTab === tab
                ? "text-blue-600 border-b-4 border-blue-600 bg-white"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab === "list" ? "🧾 Customers" : "➕ Add Customer"}
          </button>
        ))}
      </div>

      {/* Animated Tab Content */}
      <div className="p-6 bg-white min-h-[300px]">
        <div>
          <AnimatePresence mode="wait">
            {activeTab === "list" && (
              <div>
                <div className="relative w-full max-w-md mb-6">
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, phone, or ID"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg input bg-white"
                  />
                </div>
                <motion.div
                  key="list"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="card md:overflow-hidden overflow-x-auto"
                >
                  <motion.table className="w-full overflow-x-auto border border-gray-300 text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Address</th>
                        <th className="p-2 border">Action</th>
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
                  </motion.table>

                  <div className="flex justify-center">
                    {filteredCustomers.length === 0 && (
                      <div className="py-6 text-center text-gray-500">
                        <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No customer found</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "add" && (
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

        <div className="flex justify-end">
          {filteredCustomers.length > 0 && activeTab === "list" && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              pageSize={itemsPerPage}
              currentTransactions={currentCustomers}
              prevPage={prevPage}
              nextPage={nextPage}
              setPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
