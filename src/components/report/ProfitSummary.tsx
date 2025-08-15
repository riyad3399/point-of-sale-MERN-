import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMoneyBillTrendUp,
  FaCalendarDays,
  FaReceipt,
  FaCrown,
} from "react-icons/fa6";
import ProfitAccordion from "./ProfitAccordion ";

const ProfitSummary = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const fromDate = new Date(data.fromDate);
  const toDate = new Date(data.toDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-gradient-to-br from-gray-100 via-white to-gray-100 min-h-screen"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Profit */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 text-green-600">
            <FaMoneyBillTrendUp className="text-2xl" />
            <div>
              <p className="text-xs uppercase text-gray-500">Total Profit</p>
              <h2 className="text-2xl font-bold text-gray-800">
                ৳{data.totalProfit}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Total Invoices */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 text-blue-600">
            <FaReceipt className="text-2xl" />
            <div>
              <p className="text-xs uppercase text-gray-500">Total Invoices</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {data.totalInvoices}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Date Range */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 text-purple-600">
            <FaCalendarDays className="text-2xl" />
            <div>
              <p className="text-xs uppercase text-gray-500">Date Range</p>
              <h2 className="text-base font-semibold text-gray-700">
                {fromDate
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, "-")}{" "}
                <br /> <span className="text-center ml-9">to</span> <br />
                {toDate
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, "-")}
              </h2>
            </div>
          </div>
        </motion.div>
      </div>

      {data.topInvoice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-yellow-100 via-white to-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5 shadow-md mb-10"
        >
          <div className="flex justify-between items-center">
            <div className="text-yellow-800">
              <h3 className="flex items-center gap-2 text-md font-semibold">
                <FaCrown /> Top Invoice
              </h3>
              <p className="text-sm">#{data.topInvoice._id}</p>
              <p className="text-xs text-gray-500">
                {new Date(data.topInvoice.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-2xl font-bold text-yellow-800">
              ৳{data.topInvoice.totalProfit}
            </div>
          </div>
        </motion.div>
      )}

      {/* Invoice Table */}
      <ProfitAccordion data={data} />
    </motion.div>
  );
};

export default ProfitSummary;
