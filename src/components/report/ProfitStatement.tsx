import { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Local Date কে yyyy-MM-dd ফরম্যাটে রূপান্তর করার ফাংশন
const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ProfitStatement() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [profitData, setProfitData] = useState<any[]>([]);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URI;


  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      return Swal.fire({ icon: "error", title: "Please select both dates" });
    }

    try {
      const res = await axios.get(`${BASE_URL}/invoice/profit`, {
        params: {
          fromDate: formatLocalDate(fromDate),
          toDate: formatLocalDate(toDate),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfitData(res.data);
      const data = res.data;
      if (res.data) {
        navigate("/profitSummary", {
          state: {
            data,
          },
        });
      }
    } catch (err) {
      console.error("Error fetching profit data:", err);
      Swal.fire({ icon: "error", title: "Failed to fetch profit data" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto mt-10 px-6 py-8 bg-white rounded-2xl shadow-md"
    >
      <h2 className="lg:text-2xl md:text-xl text-sm font-semibold mb-6 flex items-center gap-2">
        📊 <span className="text-gray-800">Profit Statement </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            From Date
          </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={50}
            placeholderText="Select start date"
            className="w-full input transition border px-2 py-2 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            To Date
          </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={50}
            placeholderText="Select end date"
            className="w-full input transition border px-2 py-2 rounded-md"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={handleSearch}
          className="btn-primary text-xs btn-sm md:py-3"
        >
          🔍 Report
        </motion.button>
      </div>

      {/* Profit Data দেখানোর জায়গা */}
      {/* {profitData.length > 0 && (
        <div className="mt-6 space-y-3">
          {profitData.map((item) => (
            <div
              key={item._id}
              className="p-4 border rounded-md shadow-sm bg-gray-50 flex justify-between"
            >
              <span className="text-sm font-medium text-gray-700">
                Invoice #{item.transactionId}
              </span>
              <span className="text-sm font-bold text-green-700">
                ৳ {item.totalProfit.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )} */}
    </motion.div>
  );
}
