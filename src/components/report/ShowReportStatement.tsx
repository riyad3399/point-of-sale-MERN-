import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Loading from "../Loading";
import { useEffect, useState } from "react";

interface ReportStatementData {
  name: string;
  totalQuantity: number;
  totalAmount: number;
}

export default function ShowReportStatement() {
  const location = useLocation();
  const data: ReportStatementData[] = location.state || [];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-40"
      >
        <Loading />
      </motion.div>
    );
  }

  return data && data.length > 0 ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto rounded-xl shadow-lg bg-white p-4"
    >
      <table className="min-w-full border border-gray-300 table-auto text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="border border-gray-300 text-left px-4 py-2">#</th>
            <th className="border border-gray-300 text-left px-4 py-2">
               Customer Name
            </th>
            <th className="border border-gray-300 text-center px-4 py-2">
               Quantity
            </th>
            <th className="border border-gray-300 text-right px-4 py-2">
               Total Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-blue-50 transition-colors duration-200"
            >
              <td className="border border-gray-200 px-4 py-2 font-medium text-gray-500">
                {index + 1}
              </td>
              <td className="border border-gray-200 px-4 py-2 font-medium text-gray-800">
                {customer.name}
              </td>
              <td className="border border-gray-200 px-4 py-2 text-center text-blue-700 font-semibold">
                {customer.totalQuantity}
              </td>
              <td className="border border-gray-200 px-4 py-2 text-right text-green-700 font-semibold">
                ৳ {customer.totalAmount}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  ) : (
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-gray-600 mt-10"
    >
      No Data Found!
    </motion.h3>
  );
}
