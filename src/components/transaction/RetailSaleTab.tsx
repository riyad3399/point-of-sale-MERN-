import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PrinterIcon, Search, Trash } from "lucide-react";
import Loading from "../Loading";

type Transaction = {
  _id: string;
  transactionId: number;
  createdAt: string;
  dueDate: string;
  updatedAt: string;
  customer: { name: string; phone: string };
  paymentMethod: string;
  saleSystem: string;
  items: { name: string; quantity: number; price: number }[];
  totals: {
    total: number;
    discount: number;
    payable: number;
    paid: number;
    due: number;
  };
};

export default function RetailSaleTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "due">(
    "all"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Items per page

  useEffect(() => {
    axios
      .get("http://localhost:3000/invoice/retailsale")
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Data load করতে সমস্যা হয়েছে");
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const startIndex = (page - 1) * pageSize;
  const currentTransactions = transactions.slice(
    startIndex,
    startIndex + pageSize
  );

  const filtered = currentTransactions.filter((tx) => {
    const target =
      `${tx.transactionId}${tx.customer.name}${tx.customer.phone}`.toLowerCase();
    const matchesSearch = target.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "paid"
        ? tx.totals.due === 0
        : tx.totals.due > 0;

    return matchesSearch && matchesStatus;
  });

  // Pagination: Go to next page
  const nextPage = () => setPage((prev) => prev + 1);
  // Pagination: Go to previous page
  const prevPage = () => setPage((prev) => prev - 1);

  // Handle Delete
  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/invoice/retailsale/${id}`)
      .then(() => {
        setTransactions(transactions.filter((tx) => tx._id !== id));
      })
      .catch((err) => setError("Transaction delete করতে সমস্যা হয়েছে"));
  };

  // Print Invoice
  const handlePrint = (id: string) => {
    const tx = transactions.find((tx) => tx._id === id);
    if (!tx) return;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow?.document.write(`
      <html>
        <head><title>Invoice - ${tx.transactionId}</title></head>
        <body>
          <h1>Invoice #${tx.transactionId}</h1>
          <p>Customer: ${tx.customer.name} - ${tx.customer.phone}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${tx.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>৳${item.price}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div>Total: ৳${tx.totals.payable}</div>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between mb-4 gap-4 flex-wrap">
        {/* Search Box */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or ID"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Paid / Due Filter */}
        <div className="flex items-center space-x-2">
          <label className="font-medium text-sm">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "paid" | "due")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All</option>
            <option value="paid">Only Paid</option>
            <option value="due">Only Due</option>
          </select>
        </div>
      </div>

      {/* Table / Results */}
      {loading ? (
        <div className="text-center py-10 text-blue-500 font-medium">
          <Loading/>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-medium">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-center">Paid</th>
                <th className="px-4 py-2 text-center">Due</th>
                <th className="px-4 py-2 text-center">Method</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isExpanded = expandedId === tx._id;
                  return (
                    <>
                      <tr
                        key={tx._id}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : tx._id)
                        }
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{tx.transactionId}</td>
                        <td className="px-4 py-2">
                          {tx.customer.name}
                          <br />
                          <span className="text-gray-500 text-xs">
                            {tx.customer.phone}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="text-green-700">
                            ৳{tx.totals.paid}
                          </span>{" "}
                        </td>
                        <td className="px-4 py-2 text-center capitalize">
                          <span
                            className={`ml-1 text-sm font-medium ${
                              tx.totals.due > 0
                                ? "text-red-600"
                                : "text-gray-400"
                            }`}
                          >
                            {tx.totals.due > 0
                              ? `Due ৳${tx.totals.due}`
                              : "Paid"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center capitalize">
                          {tx.paymentMethod}
                        </td>
                        <td className="">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handlePrint(tx._id)}
                            >
                              <PrinterIcon />
                            </button>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(tx._id)}
                            >
                              <Trash />
                            </button>
                          </div>
                        </td>
                      </tr>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            key={`${tx._id}-details`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-50"
                          >
                            <td colSpan={7} className="px-4 py-3">
                              <div className="space-y-1 text-sm text-gray-700">
                                {tx.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between"
                                  >
                                    <span>
                                      {item.name} x{item.quantity}
                                    </span>
                                    <span>৳{item.price}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between border-t pt-2 mt-2 font-semibold">
                                  <span>Total Payable</span>
                                  <span>৳{tx.totals.payable}</span>
                                </div>
                                {tx.totals.due > 0 && (
                                  <div className="text-sm text-yellow-600 mt-1">
                                    Due date:{" "}
                                    {new Date(tx.dueDate).toLocaleDateString(
                                      "en-US"
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={prevPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={nextPage}
          disabled={currentTransactions.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
}
