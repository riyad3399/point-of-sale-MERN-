import { useState, useMemo, useEffect } from "react";
import { Eye } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDate } from "../../utils/formatDate";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function PurchaseReturnList() {
  const [query, setQuery] = useState("");
  const [purchaseReturnList, setPurchaseReturnList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


  function toCSV(items) {
    const header = ["SL", "Invoice No", "Supplier Name", "Date", "Price"];
    const lines = items.map((it, i) => [
      i + 1,
      it.invoiceNumber ?? it.invoiceNo ?? "",
      it.supplierName ?? "",
      it.returnDate
        ? new Date(it.returnDate).toLocaleDateString()
        : it.date ?? "",
      `${it.totalReturnAmount ?? it.price ?? 0} TK`,
    ]);
    return [header, ...lines]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
  }

  function downloadCSV(filename = "purchase_returns.csv") {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    const csv = toCSV(filtered);
    navigator.clipboard.writeText(csv).then(() => {
      alert("Table copied to clipboard (CSV format)");
    });
  }

  function handlePrint() {
    const html = `
      <html>
      <head>
        <title>Print - Purchase Returns</title>
        <style>table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px;text-align:left}</style>
      </head>
      <body>
        <h3>Purchase Returns</h3>
        <table>
          <thead>
            <tr><th>SL</th><th>Invoice No</th><th>Supplier Name</th><th>Date</th><th>Price</th></tr>
          </thead>
          <tbody>
            ${filtered
              .map(
                (it, i) =>
                  `<tr><td>${i + 1}</td><td>${
                    it.invoiceNumber
                  }</td><td>${capitalizeFirstLetter(
                    it.supplierName
                  )}</td><td>${formatDate(it.returnDate)}</td><td>${
                    it.totalReturnAmount ?? it.price
                  } TK</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return alert("Please allow popups to use print");
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  }

  useEffect(() => {
    const fetchPurchaseReturnList = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/purchases/return-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPurchaseReturnList(res.data.data || []);
        setCurrentPage(1);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseReturnList();
  }, [BASE_URL, token]);

  

  const filtered = useMemo(() => {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    if (!q) return purchaseReturnList;

    return purchaseReturnList.filter((it) => {
      const invoice = String(
        it.invoiceNumber ?? it.invoiceNo ?? ""
      ).toLowerCase();
      const supplier = String(it.supplierName ?? "").toLowerCase();
      const dateStr = it.returnDate
        ? new Date(it.returnDate).toLocaleDateString()
        : String(it.date || "").toLowerCase();
      const price = String(
        it.totalReturnAmount ?? it.price ?? ""
      ).toLowerCase();

      return (
        invoice.includes(q) ||
        supplier.includes(q) ||
        dateStr.includes(q) ||
        price.includes(q)
      );
    });
  }, [purchaseReturnList, query]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  if (loading) {
    return <Loading />;
  }

  const getPageNumbers = () => {
    const maxButtons = 7;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  return (
    <div className=" max-w-full">
      <Helmet>
        <title>Return Invoice | POS System</title>
      </Helmet>
      <div className="flex items-center gap-2 text-sm py-2">
        <span>Display</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1 text-sm input-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>Per Page</span>
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 border rounded bg-white text-sm"
            >
              Copy
            </button>
            <button
              onClick={() => downloadCSV("purchase_returns.csv")}
              className="px-3 py-1 border rounded bg-white text-sm"
            >
              CSV
            </button>
            <button
              onClick={() => downloadCSV("purchase_returns_excel.csv")}
              className="px-3 py-1 border rounded bg-white text-sm"
            >
              Excel
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1 border rounded bg-white text-sm"
            >
              Pdf
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1 border rounded bg-white text-sm"
            >
              Print
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Search</label>
            <input
              className="border rounded px-2 py-1 text-sm input"
              placeholder="Search by invoice or supplier"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* Table with visible borders */}
          <table className="min-w-full text-sm table-auto border border-gray-200">
            <thead>
              <tr className="text-left text-gray-600 bg-gray-50">
                <th className="py-3 px-3 border border-gray-200">SL</th>
                <th className="py-3 px-3 border border-gray-200">Invoice No</th>
                <th className="py-3 px-3 border border-gray-200">
                  Supplier Name
                </th>
                <th className="py-3 px-3 border border-gray-200">Date</th>
                <th className="py-3 px-3 border border-gray-200">Price</th>
                <th className="py-3 px-3 border border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 px-3 text-center text-gray-500 border border-gray-200"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr key={row._id} className="border-t">
                    <td className="py-3 px-3 align-top border border-gray-200">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3 px-3 align-top border border-gray-200">
                      {row.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 align-top border border-gray-200">
                      {capitalizeFirstLetter(row.supplierName)}
                    </td>
                    <td className="py-3 px-3 align-top border border-gray-200">
                      {formatDate(row.returnDate)}
                    </td>
                    <td className="py-3 px-3 align-top border border-gray-200">
                      {row.totalReturnAmount} TK
                    </td>
                    <td className="py-3 px-3 align-top border border-gray-200">
                      <Link
                        to={`/singleReturnInvoice/${row._id}`}
                        title="View"
                        className="inline-flex items-center justify-center w-9 h-9 rounded bg-green-600 text-white shadow"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="mt-4 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-2 py-1 border rounded text-sm ${
                  p === currentPage ? "bg-gray-200" : ""
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
