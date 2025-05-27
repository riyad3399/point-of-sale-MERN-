import React, { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function ReportStatementPage() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/invoice/report", {
        params: {
          fromDate: fromDate.toISOString().split("T")[0],
          toDate: toDate.toISOString().split("T")[0],
        },
      });

      console.log(res.data);
      if (res.data) {
        navigate("/showReportStatement", {
          state: { reportData: res.data, fromDate, toDate },
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch report");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto mt-10 px-6 py-8 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        📊 <span className="text-gray-800">Smart Report Statement</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={handleSearch}
          className="btn-primary transition-all text-white font-medium px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow"
        >
          🔍 Search Report
        </motion.button>
      </div>
    </motion.div>
  );
}
