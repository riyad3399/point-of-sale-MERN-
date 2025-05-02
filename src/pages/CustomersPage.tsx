import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCustomer from "../components/customer/AddCustomer";
import ShowCustomerList from "../components/customer/ShowCustomerList";
import axios from "axios";
import { Box } from "lucide-react";

interface Customer {
  customreId: number;
  customerName: string;
  phone: string;
  address?: string;
}
export default function CustomerTabs() {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Replace with your API call
    axios.get("http://localhost:3000/customer").then((res) => {
      setCustomers(res.data);
      console.log(res.data);
    });
  }, [activeTab]);
  return (
    <div className="w-full  mx-auto mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
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
        <AnimatePresence mode="wait">
          {activeTab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              <motion.table className="w-full border border-gray-300 text-left">
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
                  {customers?.map((customer) => (
                    <ShowCustomerList
                      customer={customer}
                      key={customer.customreId}
                    />
                  ))}
                </tbody>
              </motion.table>
              <div className="flex justify-center">
                {customers.length === 0 && (
                  <div className="py-6 text-center fle text-gray-500">
                    <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No customer found</p>
                  </div>
                )}
              </div>
            </motion.div>
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
    </div>
  );
}
