import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbCurrencyTaka } from "react-icons/tb";
import { Pencil, Trash2 } from "lucide-react";
import { Purchase } from "../../types";
import { handleGetSinglePurchase } from "../../utils/api";
import { usePermission } from "../../hooks/usePermission";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

interface Props {
  purchases: Purchase[];
  onDelete?: (id: string) => void;
}

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const downloadCSV = (rows: any[], filename = "purchases.csv") => {
  if (!rows || rows.length === 0) {
    alert("No rows to export");
    return;
  }
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const copyAsTSV = async (rows: any[]) => {
  if (!rows || rows.length === 0) {
    alert("No rows to copy");
    return;
  }
  const keys = Object.keys(rows[0]);
  const tsv =
    keys.join("\t") +
    "\n" +
    rows
      .map((r) =>
        keys.map((k) => String(r[k] ?? "").replace(/\t/g, " ")).join("\t")
      )
      .join("\n");
  try {
    await navigator.clipboard.writeText(tsv);
    alert("Copied to clipboard");
  } catch {
    alert("Copy failed");
  }
};

const exportExcel = (rows: any[], filename = "purchases.xlsx") => {
  if (!rows || rows.length === 0) {
    alert("No rows to export");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Purchases");
  XLSX.writeFile(wb, filename);
};

// replace your existing printRows with this function
const printRows = (rows: any[], title = "Purchases") => {
  if (!rows || rows.length === 0) {
    alert("No rows to print");
    return;
  }

  const keys = Object.keys(rows[0]);

  const tableHead = `<tr>${keys
    .map((k) => `<th>${String(k)}</th>`)
    .join("")}</tr>`;
  const tableBody = rows
    .map(
      (r) =>
        `<tr>${keys
          .map(
            (k) =>
              `<td>${String(r[k] ?? "")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  const html = `
    <html>
      <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 20px; color: #111827; }
          h1 { font-size: 18px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: left; font-size: 13px; }
          th { background: #f8fafc; font-weight: 600; }
          /* prevent breaking table cells across pages */
          tr, td, th { page-break-inside: avoid; }
          @media print {
            body { padding: 0; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>${tableHead}</thead>
          <tbody>${tableBody}</tbody>
        </table>
      </body>
    </html>`;

  // Create hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  try {
    doc.open();
    doc.write(html);
    doc.close();
  } catch (err) {
    // fallback: some CSP or older browsers may block writing to iframe -> try window.open fallback
    console.warn(
      "iframe write failed, falling back to window.open print:",
      err
    );
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      alert("Unable to open print window (popup blocked?)");
      document.body.removeChild(iframe);
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      try {
        w.print();
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return;
  }

  // Wait until iframe document is ready, then print
  const tryPrint = () => {
    try {
      const win = iframe.contentWindow!;
      // focus then print
      win.focus();
      // Some browsers require user gesture; this will still attempt to print
      win.print();
    } catch (err) {
      console.error("Print attempt failed:", err);
    } finally {
      // remove iframe after a delay so print dialog can open
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 1000);
    }
  };

  // Wait for readyState complete or fallback after timeout
  const maxWait = 2000; // ms
  const start = Date.now();
  const check = () => {
    try {
      const idoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (idoc && idoc.readyState === "complete") {
        tryPrint();
      } else if (Date.now() - start < maxWait) {
        setTimeout(check, 50);
      } else {
        // last resort
        tryPrint();
      }
    } catch (e) {
      // If cross-origin or other errors, fallback to window.open
      console.warn(
        "iframe ready check failed, falling back to window.open:",
        e
      );
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (!w) {
        alert("Unable to open print window (popup blocked?)");
        try {
          document.body.removeChild(iframe);
        } catch {}
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch (err) {
          console.error(err);
        }
      }, 300);
      try {
        document.body.removeChild(iframe);
      } catch {}
    }
  };

  check();
};

const PaginationButtons: React.FC<{
  current: number;
  total: number;
  onChange: (p: number) => void;
}> = ({ current, total, onChange }) => {
  if (total <= 1) return null;

  const visible = 5; // maximum visible page buttons
  let start = Math.max(1, current - Math.floor(visible / 2));
  let end = Math.min(total, start + visible - 1);
  if (end - start + 1 < visible) {
    start = Math.max(1, end - visible + 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(1)}
        disabled={current === 1}
        className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50"
        title="First"
      >
        «
      </button>

      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50"
        title="Previous"
      >
        ‹
      </button>

      {start > 1 && <span className="px-2 text-sm">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded ${
            p === current ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      {end < total && <span className="px-2 text-sm">…</span>}

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50"
        title="Next"
      >
        ›
      </button>

      <button
        onClick={() => onChange(total)}
        disabled={current === total}
        className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50"
        title="Last"
      >
        »
      </button>
    </div>
  );
};

const PurchaseTable: React.FC<Props> = ({ purchases, onDelete }) => {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  // Parent controls filtering; just show whatever is passed
  const filtered = useMemo(() => purchases ?? [], [purchases]);

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalRecords = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Reset / clamp current page when filtered or pageSize changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // current page slice
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(totalRecords, startIndex + pageSize);
  const pageRows = filtered.slice(startIndex, endIndex);

  const exportRows = filtered.map((p, i) => ({
    SL: i + 1,
    Invoice: p.invoiceNumber ?? "",
    Supplier: p.supplierName ?? p.supplier?.name ?? "",
    Date: formatDate(p.purchaseDate),
    Total: p.total ?? 0,
    Paid: p.paid ?? 0,
    Due: p.due ?? 0,
    PaymentMethod: p.paymentMethod ?? "",
  }));

  const exportCurrentPageRows = pageRows.map((p, i) => ({
    SL: startIndex + i + 1,
    Invoice: p.invoiceNumber ?? "",
    Supplier: p.supplierName ?? p.supplier?.name ?? "",
    Date: formatDate(p.date),
    Total: p.total ?? 0,
    Paid: p.paid ?? 0,
    Due: p.due ?? 0,
    PaymentMethod: p.paymentMethod ?? "",
  }));

  const handleView = (id: string) => {
    handleGetSinglePurchase(id, navigate);
  };

  // const handleDeleteInternal = (id: string) => {
  //   if (onDelete) return onDelete(id);
  //   if (!confirm("Are you sure to delete this purchase?")) return;
  //   console.log("Delete (no parent handler):", id);
  //   toast.success("Delete handler not implemented");
  // };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => copyAsTSV(exportRows)}
            className="px-3 py-1.5 bg-white border rounded text-sm shadow-sm"
          >
            Copy
          </button>

          <button
            onClick={() => downloadCSV(exportRows, "purchases.csv")}
            className="px-3 py-1.5 bg-white border rounded text-sm shadow-sm"
          >
            CSV
          </button>

          <button
            onClick={() => exportExcel(exportRows, "purchases.xlsx")}
            className="px-3 py-1.5 bg-white border rounded text-sm shadow-sm"
          >
            Excel
          </button>

          <button
            onClick={() => printRows(exportRows, "Purchase List")}
            className="px-3 py-1.5 bg-white border rounded text-sm shadow-sm"
          >
            Print
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">Diplay</div>

          <div className="flex items-center gap-2">
            <select
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // reset to first page when page size changes
              }}
              className="border-2 border-primary-500 rounded px-2 py-1 text-sm "
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
            <span className="text-sm text-slate-500">Per Page</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-4 py-3 w-16">SL</th>
              <th className="px-4 py-3">Invoice No</th>
              <th className="px-4 py-3">Supplier Name</th>
              <th className="px-4 py-3">Purchase Date</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Pay Method</th>{" "}
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No purchases found.
                </td>
              </tr>
            )}

            {pageRows.map((p, idx) => (
              <tr key={p._id} className="border-b hover:bg-slate-50 transition">
                <td className="px-4 py-4 text-sm text-slate-600">
                  {startIndex + idx + 1}
                </td>

                <td className="px-4 py-4">
                  <button
                    onClick={() => handleView(p._id)}
                    className="text-green-600 font-medium hover:underline text-sm"
                  >
                    {p.invoiceNumber}
                  </button>
                </td>

                <td className="px-4 py-4 text-sm text-slate-700">
                  {p.supplierName ?? p.supplier?.name ?? ""}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatDate(p.purchaseDate)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{p.due}</td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {p.paymentMethod}
                </td>

                <td className="px-4 py-4 text-sm text-right font-semibold text-slate-800">
                  <span className="inline-flex items-center gap-1 justify-end">
                    <TbCurrencyTaka className="inline" />
                    {Number(p.total || 0).toLocaleString()}
                  </span>
                </td>

                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {hasPermission("purchase", "purchase", ["edit"]) && (
                      <button
                        onClick={() => handleView(p._id)}
                        className=" btn-outline"
                        title="View / Pay"
                      >
                        <Pencil className="w-4 h-4 text-primary-600" />
                      </button>
                    )}

                    {/* {hasPermission("purchase", "purchase", ["delete"]) && (
                      <button
                        onClick={() => handleDeleteInternal(p._id)}
                        className="p-2 bg-red-50 hover:bg-red-100 rounded text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t flex flex-col md:flex-row items-center md:justify-between gap-3">
        <div className="text-sm text-slate-600">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>

        <div className="flex items-center gap-3">
          <PaginationButtons
            current={currentPage}
            total={totalPages}
            onChange={(p) => setCurrentPage(p)}
          />

          {/* quick jump */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Go to</label>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const v = Number(e.target.value) || 1;
                setCurrentPage(Math.min(Math.max(1, v), totalPages));
              }}
              className="w-16 px-2 py-1 border-2 border-primary-500 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTable;
