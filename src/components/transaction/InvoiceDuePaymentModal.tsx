import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { InvoiceType } from "../../types";
import Swal from "sweetalert2";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceType | null;
  onSave: (data: {
    paid: number;
    discount: number;
    nextDueDate?: string;
    nextDueAmount: number;
  }) => Promise<void>;
}

export default function InvoiceDuePaymentModal({
  isOpen,
  onClose,
  invoice,
  onSave,
}: Props) {
  if (!isOpen || !invoice) return null;

  const [discount, setDiscount] = useState<number | string>("");
  const [nextDueAmount, setNextDueAmount] = useState<number | string>("");
  const [nextDueDate, setNextDueDate] = useState(invoice.nextDueDate || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const updatedPayable = Math.max(
    invoice.totals.due - Number(discount || 0),
    0
  );
  const currentNextDueAmount = Math.max(
    updatedPayable - Number(nextDueAmount || 0),
    0
  );

  const handleSave = async () => {
    const paidValue = Number(nextDueAmount || 0);
    const discountValue = Number(discount || 0);

    if (paidValue < 0 || discountValue < 0) {
      Swal.fire("Error", "Negative values are not allowed.", "error");
      return;
    }

    if (paidValue + discountValue > invoice.totals.due) {
      Swal.fire(
        "Error",
        "Total (Paid + Discount) can't exceed due amount.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      await onSave({
        paid: paidValue,
        discount: discountValue,
        nextDueDate: currentNextDueAmount > 0 ? nextDueDate : undefined,
        nextDueAmount: currentNextDueAmount,
      });

      Swal.fire("Success", "Payment updated successfully!", "success");
      onClose();
    } catch (err) {
      Swal.fire("Error", "Failed to update payment!", err);
    } finally {
      setLoading(false);
    }
  };

 
  

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 max-h-screen">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            🧾 Update Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Customer Info */}
        <div className="text-sm text-gray-600 space-y-1 flex justify-between">
          <div>
            <p>
              <strong>Name:</strong> {invoice.customer.name}
            </p>
            <p>
              <strong>Phone:</strong> {invoice.customer.phone}
            </p>
          </div>
          <p>
            <strong>Invoice ID:</strong> {invoice.transactionId}
          </p>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-y-3.5 text-sm mt-4">
          <div className="text-gray-700 font-medium">Total:</div>
          <div className="text-right font-semibold">
            ৳{invoice.totals.total}
          </div>

          <div className="text-gray-700 font-medium">Previous Paid:</div>
          <div className="text-right font-semibold">৳{invoice.totals.paid}</div>
          <div className="font-medium text-red-700">Previous Due:</div>
          <div className="text-right font-semibold text-red-700">
            ৳{invoice.totals.due}
          </div>
        </div>

        {/* Editable Inputs */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Discount */}
          <label className="block text-sm text-gray-700 mb-1">
            Discount (৳)
          </label>
          <input
            type="number"
            min={0}
            placeholder="Enter discount amount"
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-right shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={discount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setDiscount("");
              else setDiscount(Number(val));
            }}
          />

          {/* Paid Now */}
          <label className="block text-sm text-gray-700 mb-1">
            Paid Now (৳)
          </label>
          <input
            type="number"
            min={0}
            placeholder="Enter paid amount"
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-right shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nextDueAmount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setNextDueAmount("");
              else setNextDueAmount(Number(val));
            }}
          />

          <div className="text-sm font-semibold text-red-700">
            Next Due Amount:
          </div>
          <div className="text-right text-sm font-semibold text-red-700">
            ৳{currentNextDueAmount}
          </div>
        </div>

        {/* Next Due Date */}
        {currentNextDueAmount > 0 && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Next Due Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-md text-white font-semibold btn-primary transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
