import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ProfitAccordion = ({ data }: { data: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 max-w-full">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-4 py-3 bg-gray-100 rounded-t-xl text-left font-semibold text-gray-800 hover:bg-gray-200 transition"
        aria-expanded={open}
        aria-controls="profit-invoice-table"
      >
        <span>🧾 Profit by Invoice</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center"
        >
          <ChevronDown className="h-5 w-5 text-gray-600" />
        </motion.span>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id="profit-invoice-table"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border border-t-0 border-gray-200 rounded-b-xl"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-left text-gray-700">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Invoice ID</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3 text-right">Profit (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.slice(0,10).map((entry: any, i: number) => (
                    <motion.tr
                      key={entry._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        #{entry._id}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-700">
                        ৳{entry.totalProfit}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfitAccordion;
