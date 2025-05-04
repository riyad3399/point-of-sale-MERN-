import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  CreditCard,
  DollarSign,
  PhoneCall,
  CheckCircle,
  Receipt,
  CalendarDays,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface CheckoutModalProps {
  onClose: () => void;
  totalAmount: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onClose,
  totalAmount,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const [paidAmount, setPaidAmount] = useState<number | "">("");
  const [discount, setDiscount] = useState<number | "">("");
  const [dueAmount, setDueAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    const paid = typeof paidAmount === "number" ? paidAmount : 0;
    const disc = typeof discount === "number" ? discount : 0;
    const payable = Math.max(totalAmount - disc, 0);
    const due = Math.max(payable - paid, 0);
    setDueAmount(due);
  }, [paidAmount, discount, totalAmount]);

  const handleCheckout = () => {
    if (dueAmount > 0 && !dueDate) return;
    setIsProcessing(true);
    setTimeout(() => {
      setTransactionId("TXN" + Date.now());
      setIsProcessing(false);
      setIsComplete(true);
    }, 1500);
  };

  const inputBase =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const paymentMethods: PaymentMethod[] = [
    { id: "cash", label: "Cash", icon: <DollarSign className="w-5 h-5" /> },
    { id: "bkash", label: "bKash", icon: <PhoneCall className="w-5 h-5" /> },
    { id: "nagad", label: "Nagad", icon: <CreditCard className="w-5 h-5" /> },
  ];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 200 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-xl font-bold">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isComplete ? (
          <div className="space-y-6 px-5 py-6">
            <div className="text-lg font-semibold flex justify-between">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Discount</label>
                <input
                  type="number"
                  className={inputBase}
                  value={discount === 0 || discount === "" ? "" : discount}
                  onChange={(e) =>
                    setDiscount(parseFloat(e.target.value) || "")
                  }
                  placeholder="৳"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Paid</label>
                <input
                  type="number"
                  className={inputBase}
                  value={
                    paidAmount === 0 || paidAmount === "" ? "" : paidAmount
                  }
                  onChange={(e) =>
                    setPaidAmount(parseFloat(e.target.value) || "")
                  }
                  placeholder="৳"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Due</label>
                <input
                  type="text"
                  className={`${inputBase} bg-gray-100 cursor-not-allowed`}
                  value={dueAmount > 0 ? dueAmount.toFixed(2) : ""}
                  readOnly
                />
              </div>
            </div>

            {dueAmount > 0 && (
              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> Due Date
                </label>
                <input
                  type="date"
                  className={`${inputBase} mt-1`}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            )}

            {/* Payment Methods */}
            <div>
              <h3 className="font-medium mb-2">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                      paymentMethod === method.id
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    {method.icon}
                    {method.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || (dueAmount > 0 && !dueDate)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 transition"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Complete
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="flex justify-center"
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold">Payment Successful!</h3>
            <p className="text-sm text-gray-600">
              Transaction ID: {transactionId}
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-2 border rounded-lg"
              >
                Close
              </button>
              <button className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
                <Receipt className="w-5 h-5" />
                Print Receipt
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;
