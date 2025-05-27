import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ReportQuantityDetailModal from "./ReportQuantityDetailModal";
import axios from "axios";

// ✅ Interfaces
interface CustomerDetail {
  name: string;
  phone: string;
  quantity: number;
  amount: number;
  transactionId: number;
  createdAt: string;
  paymentMethod: string;
}

interface ReportStatementData {
  name: string;
  productId: string;
  saleSystem: string;
  totalQuantity: number;
  totalAmount: number;
  customers: CustomerDetail[];
}

interface LocationState {
  reportData: ReportStatementData[];
  fromDate: Date;
  toDate: Date;
}

export default function ShowReportStatement() {
  const location = useLocation() as { state: LocationState };
  const { reportData, fromDate, toDate } = location.state;
  const [selectedItem, setSelectedItem] = useState<ReportStatementData | null>(
    null
  );
  const [companyInfo, setCompanyInfo] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettingInfo = async () => {
      const res = await axios.get("http://localhost:3000/setting");
      const data = await res.data.data;
      setCompanyInfo(data);
    };

    fetchSettingInfo();
  }, []);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=600");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Audit_Report</title>
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 0.5in;
                }
                body {
                  font-family: sans-serif;
                  background: white;
                  margin: 0;
                  padding: 0.5in;
                  -webkit-print-color-adjust: exact;
                }
                .print-hide { display: none; }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                table, th, td {
                  border: 1px solid #ccc;
                }
                th, td {
                  padding: 6px 8px;
                  text-align: left;
                }
                th {
                  background-color: #f0f0f0;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom: 1px solid #ccc;
                  padding-bottom: 16px;
                  margin-bottom: 24px;
                }
                .header img {
                  width: 80px;
                  height: 80px;
                  object-fit: contain;
                }
                .header-info {
                  text-align: right;
                  font-size: 12px;
                  line-height: 1.4;
                }
                .header-info h1 {
                  font-size: 16px;
                  font-weight: bold;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityClick = (item: ReportStatementData) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const totalAmount = reportData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Print Button */}
      <div className="flex justify-between mb-6 print:hidden">
        <Link to="/reportStatement">
          <button className="flex mb-4 items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </Link>

        <motion.button
          onClick={handlePrint}
          className="relative overflow-hidden rounded-md btn-primary text-white 
            transition duration-300 ease-in-out "
          whileTap={{ scale: 0.95 }}
        >
          প্রিন্ট করুন
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-white opacity-10 rounded-md pointer-events-none"
          ></span>
        </motion.button>
      </div>

      {/* Printable Content */}
      <div
        ref={printRef}
        className="bg-white mx-auto p-10 rounded-xl shadow-lg print:shadow-none print:p-0 print:m-0 print:rounded-none
          transition-all duration-500 ease-in-out"
      >
        {/* Header */}
        <div className="header flex flex-col md:flex-row justify-between items-center border-b border-gray-300 pb-4 mb-8">
          <div className="flex items-center gap-x-4 print:relative">
            <div className="w-24 h-24 md:w-28 md:h-28 print:w-20 print:h-20 mb-4 md:mb-0">
              <img
                src={
                  companyInfo.logo
                    ? encodeURI(companyInfo.logo)
                    : "/fallback-logo.png"
                }
                alt="Logo"
                className="w-full h-full border object-cover filter drop-shadow-md rounded-md"
              />
            </div>
            <h3 className="text-base border drop-shadow-lg p-1.5 rounded-md print:absolute print:right-10 ">
              Sales Summary
            </h3>
          </div>
          <div className="header-info text-center md:text-right text-sm leading-relaxed print:text-xs ">
            <h1 className="text-lg md:text-xl font-extrabold print:text-base tracking-wide">
              {companyInfo?.storeName}
            </h1>
            <p className="text-gray-700">
              {companyInfo?.city}, {companyInfo?.state}
            </p>
            <p className="text-gray-600">Contact: {companyInfo?.phone}</p>
            <p className="text-gray-600">Email: {companyInfo?.email}</p>
            <p>
              <strong className="space-x-1">
                <span> Period:</span>
                <span>
                  {`${fromDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`}
                </span>
                <span>to</span>
                <span>
                  {`${toDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`}
                </span>
              </strong>
            </p>
          </div>
        </div>

        {/* Data Table */}
        {reportData.length > 0 ? (
          <div>
            <table className="w-full border border-gray-300 text-sm rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700 font-semibold uppercase">
                <tr>
                  <th className="border px-3 py-2 text-left w-10">#</th>
                  <th className="border px-3 py-2 text-left">Item Name</th>
                  <th className="border px-3 py-2 text-center w-32">
                    Quantity
                  </th>
                  <th className="border px-3 py-2 text-right w-44">
                    Amount (৳)
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200"
                    style={{
                      animation: `fadeInUp 0.3s ease forwards`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{item.name}</td>
                    <td
                      onClick={() => handleQuantityClick(item)}
                      className="border px-3 py-2 text-center cursor-pointer"
                    >
                      {item.totalQuantity}
                    </td>
                    <td className="border px-3 py-2 text-right text-green-700 font-semibold">
                      ৳ {item.totalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
              <ReportQuantityDetailModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                itemName={selectedItem?.name || ""}
                customers={selectedItem?.customers || []}
              />
            </table>

            {/* Footer */}
            <div className="mt-10 flex flex-col md:flex-row justify-between items-center border-t border-gray-300 pt-4">
              <p className="text-lg font-semibold text-gray-800">
                Total Amount :
                <span className="text-green-700 text-lg font-extrabold">
                  ৳ {totalAmount}
                </span>
              </p>
              <div
                className="mt-4 md:mt-0 text-center text-xs text-gray-600 border border-dashed border-gray-400 px-8 py-4 rounded-lg
            select-none font-mono tracking-wide bg-gray-50"
              >
                <p className="border-t pt-2 font-semibold">
                  অনুমোদিত কর্তৃপক্ষ
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center font-bold text-lg text-red-500">
            No data find this Date !
          </div>
        )}
      </div>

      {/* Custom CSS for fadeInUp */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
