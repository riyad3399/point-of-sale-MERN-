import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CustomerDetail {
  name: string;
  phone: string;
  quantity: number;
  amount: number;
  transactionId: number;
  createdAt: string;
  paymentMethod: string;
  saleSystem: string;
}

interface QuantityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  customers: CustomerDetail[];
}

export default function ReportQuantityDetailModal({
  isOpen,
  onClose,
  itemName,
  customers,
}: QuantityDetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl min-h-[90vh] overflow-y-auto relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-500 tracking-wide">
                <span className="text-indigo-600">{itemName}</span> - Quantity
                Breakdown
              </h2>
              <p className="text-sm text-gray-500">
                Total {customers.length} transaction
                {customers.length > 1 && "s"}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-xl shadow-sm">
                <thead className="bg-indigo-50 text-gray-700 font-medium">
                  <tr>
                    <th className="border px-3 py-2">#</th>
                    <th className="border px-3 py-2 text-left">Invoice ID</th>
                    <th className="border px-3 py-2 text-left">Customer</th>
                    <th className="border px-3 py-2 text-left">Phone</th>
                    <th className="border px-3 py-2 text-center">Quantity</th>
                    <th className="border px-3 py-2 text-right">Amount (৳)</th>
                    <th className="border px-3 py-2 text-center">Date</th>
                    <th className="border px-3 py-2 text-center">Readmark</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((cust, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="border px-3 py-2 text-center">
                        {idx + 1}
                      </td>
                      <td className="border px-3 py-2">{cust.transactionId}</td>
                      <td className="border px-3 py-2">
                        {cust.name.charAt(0).toUpperCase() +
                          cust.name.slice(1).toLowerCase()}
                      </td>
                      <td className="border px-3 py-2">{cust.phone}</td>
                      <td className="border px-3 py-2 text-center">
                        {cust.quantity}
                      </td>
                      <td className="border px-3 py-2 text-right text-green-700 font-semibold">
                        ৳ {cust.amount}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {new Date(cust.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {cust.saleSystem.charAt(0).toUpperCase() +
                          cust.saleSystem.slice(1).toLowerCase()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
