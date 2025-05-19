import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { EditIcon, PrinterIcon, Search, Trash, ViewIcon } from "lucide-react";
import Loading from "../Loading";
import Pagination from "../Pagination";
import { InvoiceType } from "../../types";
import { useNavigate } from "react-router-dom";
import InvoiceDuePaymentModal from "./InvoiceDuePaymentModal";

export default function AllTransactions() {
  const [transactions, setTransactions] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "due">(
    "all"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Items per page
  const [editingInvoice, setEditingInvoice] = useState<InvoiceType | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/invoice")
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Data load করতে সমস্যা হয়েছে");
        setLoading(false);
      });
  }, [transactions]);

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
      .delete(`http://localhost:3000/invoice/${id}`)
      .then(() => {
        setTransactions(transactions.filter((tx) => tx._id !== id));
      })
      .catch((err) => setError("InvoiceType delete করতে সমস্যা হয়েছে"));
  };

  // handle invoice view
  const handleInvoiceView = async (id: string) => {
    await axios.get(`http://localhost:3000/invoice/${id}`).then((res) => {
      navigate("/invoiceView", { state: { invoice: res.data } });
    });
  };

  // Edit modal open handler
  const handleEdit = (invoice: InvoiceType) => {
    setEditingInvoice(invoice);
    setModalOpen(true);
    console.log(invoice);
  };

  const handleSaveEdit = async (updatedData: any) => {
    if (!editingInvoice) return;

    try {
      const res = await axios.put(
        `http://localhost:3000/invoice/${editingInvoice._id}`,
        updatedData
      );

      // 🧠 update local state:
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === editingInvoice._id ? { ...tx, ...res.data } : tx
        )
      );

      setModalOpen(false); // modal close
      setEditingInvoice(null); // reset state
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Print Invoice
  const handlePrint = (id: string) => {
    const tx = transactions.find((tx) => tx._id === id);
    if (!tx) return;

   

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Invoice - ${tx.transactionId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            h1 {
              margin: 0;
            }
            .section {
              margin-bottom: 20px;
            }
            .customer-info, .invoice-info {
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #aaa;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
            .totals {
              text-align: right;
              font-size: 16px;
              margin-top: 10px;
            }
            .totals div {
              margin-bottom: 4px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 14px;
              color: #777;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .header img {
              height: 60px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1>Invoice #${tx.transactionId}</h1></div>
            <img id="invoiceLogo" src="https://i.ibb.co/mHZkPKd/r-logo.png" alt="Logo" />
          </div>
    
          <div class="section customer-info">
            <strong>Customer:</strong> ${tx.customer.name} (${
      tx.customer.phone
    })<br/>
            <strong>Date:</strong> ${new Date(
              tx.createdAt
            ).toLocaleDateString()}
          </div>
    
          <div class="section">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price (৳)</th>
                </tr>
              </thead>
              <tbody>
                ${tx.items
                  .map(
                    (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>৳${item.price.toFixed(2)}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
    
          <div class="section totals" style="display:flex; justify-content: space-between;align-items:flex-start; text-align: right">
            <div style=" text-align: justify; text-align-last: left;">
              <div><strong>Total:</strong> ৳${tx.totals.total.toFixed(2)}</div>
              <div><strong>Discount:</strong> ৳${tx.totals.discount.toFixed(
                2
              )}</div>
            </div>
            <div style=" text-align: justify; text-align-last: left;">
              <div><strong>Payable:</strong> ৳${tx.totals.payable.toFixed(
                2
              )}</div>
              <div><strong>Paid:</strong> ৳${tx.totals.paid.toFixed(2)}</div>
            </div>
            <div style=" text-align: justify; text-align-last: left;">
              <div><strong>Due:</strong> ৳${tx.totals.due.toFixed(2)}</div>
              ${
                tx.dueDate
                  ? `<div><strong>Due Date:</strong> ${new Date(
                      tx.dueDate
                    ).toLocaleDateString()}</div>`
                  : ""
              }
              ${
                tx.nextDueDate
                  ? `<div><strong>Next Due Date:</strong> ${new Date(
                      tx.nextDueDate
                    ).toLocaleDateString()}</div>`
                  : ""
              }
            </div>
          </div>
    
          ${
            tx.paymentDetails && tx.paymentDetails.length > 0
              ? `
          <div class="section">
            <h3 style="margin-top: 40px; font-size: 16px;">Payment History</h3>
            ${tx.paymentDetails
              .map(
                (p) => `
              <div style="border: 1px solid #ccc; border-radius: 6px; padding: 10px; margin-bottom: 10px; font-size: 14px;">
                <div><strong>Payment Date:</strong> ${new Date(
                  p.currentPaymentDate
                ).toLocaleDateString()}</div>
                <div><strong>Discount:</strong> ৳${p.discount.toFixed(2)}</div>
                <div><strong>Paid:</strong> ৳${p.paid.toFixed(2)}</div>
                <div><strong>Next Due Amount:</strong> ৳${p.nextDueAmount.toFixed(
                  2
                )}</div>
                <div><strong>Next Due Date:</strong> ${new Date(
                  p.nextDueDate
                ).toLocaleDateString()}</div>
              </div>
            `
              )
              .join("")}
          </div>
          `
              : ""
          }
    
          <div class="footer">
            Thank you for your business!
          </div>
    
          <script>
            const logo = document.getElementById('invoiceLogo');
            if (logo.complete) {
              window.print();
              window.close();
            } else {
              logo.onload = () => {
                window.print();
                window.close();
              };
            }
          </script>
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
          <Loading />
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
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handlePrint(tx._id)}
                            >
                              <PrinterIcon />
                            </button>
                            <button
                              onClick={() => handleInvoiceView(tx._id)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <ViewIcon />
                            </button>
                            <button
                              className="ml-2 text-green-500 hover:text-green-700"
                              onClick={() => handleEdit(tx)}
                            >
                              <EditIcon />
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

      <InvoiceDuePaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        invoice={editingInvoice}
        onSave={handleSaveEdit}
      />

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(transactions.length / pageSize)}
          pageSize={pageSize}
          currentTransactions={currentTransactions}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </div>
    </div>
  );
}
