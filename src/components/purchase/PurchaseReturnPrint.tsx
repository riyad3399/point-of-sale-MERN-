import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Loading from "../Loading";

export default function PurchaseReturnPrint() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [singleReturnData, setSingleReturnData] = useState({});
  const BASE_URL = import.meta.env.VITE_BASE_URI;
  const { id } = useParams();

  const d = singleReturnData;

  const formatDateTime = (iso) => {
    if (!iso) return "";
    const dt = new Date(iso);
    return dt.toLocaleString();
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchSinglePurchaseList = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/purchases/return-list/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setSingleReturnData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSinglePurchaseList();
  }, [BASE_URL, token, id]);

  if (loading) {
     return <Loading/>
  }

  return (
    <div className=" min-h-screen bg-gray-50">
      <div className="max-w-full  bg-white border rounded-lg p-8 print:border-none print:shadow-none">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            {d.shopName || "Shop Name"}
          </h2>
          <p className="mt-2 text-slate-600">
            Supplier Name:{" "}
            <span className="font-medium text-slate-800">
              {capitalizeFirstLetter(d.supplierName)}
            </span>
          </p>
          <p className="text-slate-600">
            Date :{" "}
            <span className="font-medium text-slate-800">
              {formatDate(d.returnDate)}
            </span>
          </p>
          <p className="text-slate-600">
            Invoice No :
            <span className="font-medium text-slate-800">
              {d.invoiceNumber}
            </span>
          </p>
          <p className="text-slate-600">
            Print Date:{" "}
            <span className="font-medium text-slate-800">
              {formatDateTime(new Date())}
            </span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm border">
            <thead>
              <tr className="text-left text-slate-700 bg-slate-50 border">
                <th className="py-3 px-4 border">Ingredient Name</th>
                <th className="py-3 px-4 border">Return Qty</th>
                <th className="py-3 px-4 border">Price</th>
                <th className="py-3 px-4 border">Discount</th>
                <th className="py-3 px-4 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {d.items && d.items.length ? (
                d.items.map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-4 px-4 border">
                      {capitalizeFirstLetter(it.productName)}
                    </td>
                    <td className="py-4 px-4 border">
                      {it.qty} {it.unit || ""}
                    </td>
                    <td className="py-4 px-4 border">{it.price}</td>
                    <td className="py-4 px-4 border">{it.discount || 0}</td>
                    <td className="py-4 px-4 border">{it.lineTotal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-4 text-center text-slate-500"
                  >
                    No items to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <p className="font-semibold text-slate-700">Reason</p>
            <p className="text-slate-600 mt-2">{d.reason || "No Reason"}</p>
          </div>

          <div className="flex justify-center md:justify-end">
            <button
              onClick={handlePrint}
              className="bg-primary-400 hover:bg-primary-500 text-white px-5 py-2 rounded shadow print:hidden"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Simple footer to give whitespace on screen when not printing */}
      <div className="max-w-5xl mx-auto mt-8 text-center text-slate-400 text-xs">
        &nbsp;
      </div>

      {/* Print styles (only minimal inline for the component) */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          button { display: none !important; }
          .print\:border-none { border: none !important; }
          .print\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
