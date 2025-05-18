import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, CreditCard, DollarSign, Receipt, CheckCircle } from "lucide-react";
import { Product } from "../../types";

interface CheckoutModalProps {
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);
  const [allProduct, setAllProduct] = useState<Product[]>([]);

  const handleCheckout = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);

    try {
      const result = await checkout(paymentMethod);
      setTransaction(result);
      setIsComplete(true);
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
  };

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: <DollarSign className="h-5 w-5" /> },
    {
      id: "card",
      label: "Credit Card",
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];
  useEffect(() => {
    const handleGetProduct = async () => {
      const res = await axios.get("http://localhost:3000/product");
      const data = await res.data;
      setAllProduct(data);
    };
    handleGetProduct();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Checkout</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isComplete ? (
          <>
            {/* Order Summary */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="max-h-48 overflow-y-auto mb-3">
                {allProduct.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span>
                      {item.quantity} × {item.productName}
                    </span>
                    <span className="font-medium">
                      {item.wholesalePrice ? (
                        <span>
                          ${(item.wholesalePrice * item.quantity).toFixed(2)}
                        </span>
                      ) : (
                        <span>
                          ${(item.retailPrice * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-sm pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  {/* <span>${cartTotal.toFixed(2)}</span> */}
                </div>
                <div className="flex justify-between">
                  <span>Tax (7%)</span>
                  {/* <span>${taxAmount.toFixed(2)}</span> */}
                </div>
                <div className="flex justify-between font-bold pt-2 text-base">
                  <span>Total</span>
                  {/* <span>${grandTotal.toFixed(2)}</span> */}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium mb-3">Payment Method</h3>

              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    className={`
                      flex items-center justify-center gap-2 p-4 rounded-lg border 
                      ${
                        paymentMethod === method.id
                          ? "bg-primary-50 border-primary-200 text-primary-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }
                    `}
                    onClick={() => setPaymentMethod(method.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {method.icon}
                    <span>{method.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 flex gap-3">
              <button
                onClick={onClose}
                className="btn-outline flex-1"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={!paymentMethod || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white/20 border-t-white rounded-full mr-1"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Complete Sale
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
              >
                <CheckCircle className="h-16 w-16 text-success-500 mb-2" />
              </motion.div>
              <h3 className="text-xl font-bold text-center">
                Payment Successful!
              </h3>
              <p className="text-gray-600 text-center mt-1">
                Transaction #{transaction?.id.substring(0, 8)}
              </p>
            </div>

            <div className="space-y-1 text-sm mb-6">
              <div className="flex justify-between font-medium">
                <span>Payment method</span>
                <span className="capitalize">{transaction?.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total amount</span>
                <span>${transaction?.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Date</span>
                <span>{new Date(transaction?.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-outline flex-1">
                Close
              </button>
              <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Receipt className="h-5 w-5" />
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
