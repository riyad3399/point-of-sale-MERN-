import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clock,
  ShoppingBag,
  Trash2,
  CreditCard,
} from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";
import { Purchase } from "../../types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { handleGetSinglePurchase } from "../../utils/api";
import { usePermission } from "../../hooks/usePermission";

interface PurchaseCardProps {
  purchase: Purchase;
  isExpanded: boolean;
  toggleExpand: (id: string) => void;
  getPaymentIcon: (method: string) => React.ReactNode;
  variants: any;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({
  purchase,
  isExpanded,
  toggleExpand,
  getPaymentIcon,
  variants,
}) => {
  const progress = (purchase.paid / purchase.total) * 100;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const handlePayment = (id: string) => {
    handleGetSinglePurchase(id, navigate);
  };

  const handleDelete = () => {
    console.log("Delete Purchase:", purchase._id);
    // delete confirmation / logic here
  };

  return (
    <motion.div
      variants={variants}
      layout
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-2xl shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
    >
      {/* Card Header */}
      <div>
        <div
          className="p-6 relative"
          onClick={() => toggleExpand(purchase._id)}
        >
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {purchase.due > 0 ? (
              <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-bold">
                <AlertCircle className="w-3 h-3" />
                {t("purchase.due")}
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold">
                <CheckCircle className="w-3 h-3" />
                {t("purchase.paid")}
              </div>
            )}
          </div>

          {/* Supplier & Date */}
          <h3 className="text-xl font-bold text-slate-800 mb-1 pr-16">
            {purchase.supplier.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(purchase.date).toLocaleDateString("en-GB")}
            </div>
            <div className="flex items-center gap-1">
              {getPaymentIcon(purchase.paymentMethod)}
              {purchase.paymentMethod}
            </div>
          </div>

          {/* Amount Display */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-slate-800 flex items-center">
                <TbCurrencyTaka className="inline mr-1" />
                {purchase.total.toLocaleString()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`absolute h-full rounded-full ${
                  progress === 100
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-indigo-400 to-indigo-600"
                }`}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
              <span>
                {t("purchase.paid")}: ৳{purchase.paid.toLocaleString()}
              </span>
              {purchase.due > 0 && (
                <span className="text-red-500 font-bold">
                  {t("purchase.due")}: ৳{purchase.due.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Expand Button */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="absolute bottom-1 right-4 flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full"
          >
            <ChevronDown className="w-5 h-5 text-slate-600" />
          </motion.div>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-6">
              {/* Items List */}
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-500" />
                {t("purchase.items")} ({purchase.items.length})
              </h4>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                {purchase.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm"
                  >
                    <div>
                      <p className="text-xs text-slate-500">
                        {item.quantity} pcs × ৳{item.purchasePrice}
                      </p>
                    </div>
                    <span className="font-semibold text-sm text-slate-800">
                      ৳{(item.quantity * item.purchasePrice).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">
                      ৳{purchase.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount Paid</span>
                    <span className="font-semibold text-green-600">
                      ৳{purchase.paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-indigo-200 pt-2 flex justify-between font-bold">
                    <span className="text-slate-800">Total Due</span>
                    <span
                      className={
                        purchase.due > 0 ? "text-red-600" : "text-slate-600"
                      }
                    >
                      ৳{purchase.due.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                {hasPermission("purchase", "purchase", ["edit"]) && (
                  <button
                    onClick={() => handlePayment(purchase._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                  </button>
                )}
                {hasPermission("purchase", "purchase", ["delete"]) && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PurchaseCard;
