import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface InvoiceType {
  invoice: {
    createdAt: string;
    updatedAt: string;
    dueDate: string;
    customer: { name: string; phone: string };
    paymentMethod: string;
    saleSystem: string;
    transactionId: number;
    items: { name: string; quantity: number; price: number; total: number }[];
    totals: {
      total: number;
      discount: number;
      payable: number;
      paid: number;
      due: number;
    };
  };
}

export default function InvoiceView() {
  const location = useLocation();
  const { invoice }: InvoiceType = location.state || {};

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/transactions" className="btn-primary mb-3">
        Back
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className=" p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl bg-white space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Invoice #{invoice.transactionId}
            </h2>
            <p className="text-sm text-gray-500">
              Created: {new Date(invoice.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Due:{" "}
              {invoice.dueDate
                ? new Date(invoice.dueDate).toLocaleDateString()
                : 0}
            </p>
          </div>
          <div className="text-left md:text-right space-y-1">
            <p className="text-md font-medium text-gray-700">
              Sale Type:{" "}
              <span className="font-semibold">{invoice.saleSystem}</span>
            </p>
            <p className="text-md font-medium text-gray-700">
              Payment:{" "}
              <span className="font-semibold">{invoice.paymentMethod}</span>
            </p>
          </div>
        </div>

        {/* Customer and Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl shadow-sm">
          <div>
            <h4 className="text-lg font-semibold mb-1">Customer Info</h4>
            <p className="text-gray-800">👤 Name: {invoice.customer.name}</p>
            <p className="text-gray-800">📞 Phone: {invoice.customer.phone}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-1">Payment Summary</h4>
            <div className="space-y-1 text-gray-800">
              <p>
                Total:{" "}
                <span className="font-semibold">৳{invoice.totals.total}</span>
              </p>
              <p>
                Discount:{" "}
                <span className="font-semibold">
                  ৳{invoice.totals.discount}
                </span>
              </p>
              <p>
                Payable:{" "}
                <span className="font-semibold">৳{invoice.totals.payable}</span>
              </p>
              <p>
                Paid:{" "}
                <span className="font-semibold">৳{invoice.totals.paid}</span>
              </p>
              <p className="text-red-600 font-bold">
                Due: ৳{invoice.totals.due}
              </p>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800 flex gap-x-1.5">
            <ShoppingCart /> Items
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {invoice?.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors p-2 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × ৳{item.price}
                  </p>
                </div>
                <div className="text-right text-lg font-semibold text-gray-800">
                  ৳{item.total}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
