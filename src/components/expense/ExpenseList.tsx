import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ExpenseItem {
  category: string;
  remarks: string;
  unitPrice: number;
  quantity: number;
}

interface Expense {
  _id: string;
  date: string;
  method: string;
  items: ExpenseItem[];
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("");

  const fetchExpenses = async () => {
    try {
      const params: any = {};
      if (date) params.date = date;
      if (method) params.method = method;

      const res = await axios.get("http://localhost:3000/expenses", { params });
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses(); // load on page load
  }, []);

  useEffect(() => {
    fetchExpenses(); // fetch whenever filter changes
  }, [date, method]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-4 items-end bg-white p-4 rounded-xl shadow border">
        <div className="flex items-center gap-1">
          <strong className="text-sm">
            Filter: 
          </strong>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-md px-3 py-2 ring-1 ring-blue-500 focus:ring-2 outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          <strong className=" text-sm ">
            Filter:
          </strong>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="border rounded-md px-3 py-2 ring-1 ring-blue-500 focus:ring-2 outline-none"
          >
            <option value="">All</option>
            <option value="CASH">Cash</option>
            <option value="BKASH">Bkash</option>
            <option value="BANK">Bank</option>
          </select>
        </div>

        
      </div>

      {/* Expense List */}
      {expenses.map((expense, index) => (
        <motion.div
          key={expense._id}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">
              Date:{" "}
              <span className="font-semibold text-gray-800">
                {expense.date}
              </span>
            </div>
            <div className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
              {expense.method}
            </div>
          </div>
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Remarks</th>
                <th className="px-3 py-2 text-center">Unit Price</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {expense.items.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2">{item.category}</td>
                  <td className="px-3 py-2">{item.remarks}</td>
                  <td className="px-3 py-2 text-center">৳ {item.unitPrice}</td>
                  <td className="px-3 py-2 text-center">{item.quantity}</td>
                  <td className="px-3 py-2 text-center font-semibold text-red-500">
                    ৳ {item.unitPrice * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ))}

      {/* No data case */}
      {expenses.length === 0 && (
        <div className="text-center text-gray-500 font-semibold mt-10">
          No expenses found.
        </div>
      )}
    </div>
  );
}
