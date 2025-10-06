import { useState, useMemo, useEffect } from "react";
import { Eye } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

export default function PurchaseReturnList() {
  const [query, setQuery] = useState("");
  const [purchaseReturnList, setPurchaseReturnList] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [rows] = useState(data);
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;

 

  // Export helpers
  function toCSV(items) {
    const header = ["SL", "Invoice No", "Supplier Name", "Date", "Price"];
    const lines = items.map((it, i) => [
      i + 1,
      it.invoiceNo,
      it.supplierName,
      it.date,
      `${it.price} TK`,
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
    // open a new window with a clean table for printing
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
            ${purchaseReturnList
              .map(
                (it, i) =>
                  `<tr><td>${i + 1}</td><td>${it.invoiceNumber}</td><td>${
                    it.supplierName
                  }</td><td>${new Date(it.returnDate).toLocaleDateString()}</td><td>${
                    it.totalReturnAmount
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
        setPurchaseReturnList(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseReturnList();
  }, [BASE_URL, token]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className=" max-w-full">
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
              className="border rounded px-2 py-1 text-sm"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-3 px-3">SL</th>
                <th className="py-3 px-3">Invoice No</th>
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseReturnList?.map((row, idx) => (
                <tr key={row._id} className="border-t">
                  <td className="py-3 px-3 align-top">{idx + 1}</td>
                  <td className="py-3 px-3 align-top">{row.invoiceNumber}</td>
                  <td className="py-3 px-3 align-top">
                    {capitalizeFirstLetter(row.supplierName)}
                  </td>
                  <td className="py-3 px-3 align-top">
                    {new Date(row.returnDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 align-top">
                    {row.totalReturnAmount} TK
                  </td>
                  <td className="py-3 px-3 align-top">
                    <button
                      title="View"
                      className="inline-flex items-center justify-center w-9 h-9 rounded bg-green-600 text-white shadow"
                      onClick={() => alert(`View invoice ${row.invoiceNumber}`)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
