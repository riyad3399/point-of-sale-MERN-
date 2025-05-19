import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, X, Printer } from "lucide-react";

type PaymentDetail = {
  currentPaymentDate: string;
  discount: number;
  paid: number;
  nextDueAmount: number;
  nextDueDate: string;
  _id: string;
};

type PaymentDetailsProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  paymentDetailsData: {
    customer: {
      name: string;
      phone: string;
    };
    paymentDetails: PaymentDetail[];
  };
};


const ViewPaymentDetailsModal = ({
  isOpen,
  setIsOpen,
  paymentDetailsData,
}: PaymentDetailsProps) => {
  const { paymentDetails, customer } = paymentDetailsData;
  console.log(paymentDetails, customer);
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handlePrint = () => {
    const printContents = document.getElementById("printable-area")?.innerHTML;

    if (printContents) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Payment History</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                color: #000;
              }
              .print-box {
                margin-bottom: 20px;
                padding: 15px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background-color: #f3f4f6;
              }
              h1, h2 {
                text-align: center;
              }
              p {
                font-size: 14px;
                margin: 5px 0;
              }
              .label {
                font-weight: bold;
                color: #374151;
              }
            </style>
          </head>
          <body>
            <h1>Alim Traders</h1>
            <h2>Customer Payment History</h2>
            ${printContents}
            <p style="text-align:center;margin-top:40px;">--- End of Report ---</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-2xl max-w-lg h-[90vh] shadow-2xl p-6 w-[90%] flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-center mb-5 gap-2">
            <CalendarDays className="text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
          </div>

          {/* Print Button */}
          {paymentDetails.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="mb-4 w-fit btn-primary text-white py-2 rounded-xl font-semibold shadow flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </motion.button>
          )}

          {/* Payment Details */}
          <div
            id="printable-area"
            className="overflow-y-auto flex-1 space-y-4 pr-2"
          >
            {paymentDetails.length > 0 ? (
              paymentDetails.map((payment, index) => (
                <motion.div
                  key={payment._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  className="print-box bg-gray-50 p-4 rounded-xl border"
                >
                  <p>
                    <span className="label">Payment Date:</span>{" "}
                    {formatDate(payment.currentPaymentDate)}
                  </p>
                  <p>
                    <span className="label">Discount:</span> ৳
                    {payment.discount.toFixed(2)}
                  </p>
                  <p>
                    <span className="label">Paid:</span> ৳
                    {payment.paid.toFixed(2)}
                  </p>
                  <p>
                    <span className="label">Next Due Amount:</span> ৳
                    {payment.nextDueAmount.toFixed(2)}
                  </p>
                  <p>
                    <span className="label">Next Due Date:</span>{" "}
                    {formatDate(payment.nextDueDate)}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No payment records found.
              </p>
            )}
          </div>

          {/* Bottom Close Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full btn-primary text-white py-2 rounded-xl font-semibold shadow"
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewPaymentDetailsModal;
