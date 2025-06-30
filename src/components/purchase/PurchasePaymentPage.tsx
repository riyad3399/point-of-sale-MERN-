import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  TbCurrencyTaka,
  TbReceipt,
  TbCreditCard,
  TbCheck,
  TbClock,
  TbUser,
  TbPhone,
  TbCalendar,
  TbInfoCircle,
  TbPercentage,
  TbDownload,
  TbPrinter,
  TbHistory,
  TbBulb,
  TbShieldCheck,
  TbArrowLeft,
  TbCalculator,
  TbDeviceFloppy,
} from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../Loading";
import { handleUpdatePurchasePayment } from "../../utils/api";
import PurchasePaymentHeader from "../helper/PurchasePaymentHeader";

export default function PurchasePaymentPage() {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showQuickAmounts, setShowQuickAmounts] = useState(true);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [savedDraft, setSavedDraft] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const purchase = location.state;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const watchedAmount = watch("amount");
  const watchedMethod = watch("method");
  const watchedNote = watch("note");

  // Smart quick amount options
  const quickAmounts = [
    {
      label: "25%",
      value: Math.round(purchase?.due * 0.25),
      color: "from-blue-400 to-blue-500",
    },
    {
      label: "50%",
      value: Math.round(purchase?.due * 0.5),
      color: "from-green-400 to-green-500",
    },
    {
      label: "75%",
      value: Math.round(purchase?.due * 0.75),
      color: "from-yellow-400 to-yellow-500",
    },
    {
      label: "Full",
      value: purchase?.due,
      color: "from-purple-400 to-purple-500",
    },
  ];

  // Auto-save draft functionality
  useEffect(() => {
    const draft = {
      amount: watchedAmount,
      method: watchedMethod,
      note: watchedNote,
    };

    if (watchedAmount || watchedMethod || watchedNote) {
      const timer = setTimeout(() => {
        setSavedDraft(draft);
        localStorage.setItem(
          `payment_draft_${purchase?._id}`,
          JSON.stringify(draft)
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [watchedAmount, watchedMethod, watchedNote, purchase?._id]);

  // Load saved draft on mount
  useEffect(() => {
    if (purchase?._id) {
      const saved = localStorage.getItem(`payment_draft_${purchase._id}`);
      if (saved) {
        const draft = JSON.parse(saved);
        setValue("amount", draft.amount);
        setValue("method", draft.method);
        setValue("note", draft.note);
        setSavedDraft(draft);
      }
    }
  }, [purchase?._id, setValue]);

  // Smart payment method suggestions
  const getRecommendedMethod = useCallback((amount) => {
    if (!amount) return null;
    if (amount <= 1000) return "Cash";
    if (amount <= 10000) return "bKash";
    return "Bank";
  }, []);

  // Smart amount validation with suggestions
  const getAmountValidation = useCallback(
    (value) => {
      if (!value) return "Amount is required";
      if (value < 1) return "Minimum amount is ৳1";
      if (value > purchase?.due)
        return `Cannot exceed due amount of ৳${purchase.due}`;
      return true;
    },
    [purchase?.due]
  );

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const amount = Number(data.amount);
      const method = data.method;
      const note = data.note || "";
      const id = purchase._id;

      handleUpdatePurchasePayment(amount, method, note, id);

      // Clear draft
      localStorage.removeItem(`payment_draft_${purchase._id}`);

      
      setPaymentSuccess(true);
      setTimeout(() => {
        if (showReceipt) {
          // Stay on page to show receipt
        } else {
          navigate("/purchase");
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      // Better error handling
      const errorMessage =
        error.response?.data?.message || "Payment failed. Please try again.";
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (amount) => {
    setValue("amount", amount);
    setSelectedQuickAmount(amount);

    // Auto-suggest payment method
    const recommended = getRecommendedMethod(amount);
    if (recommended && !watchedMethod) {
      setValue("method", recommended);
    }
  };

  const paymentMethods = [
    {
      value: "Cash",
      icon: "💵",
      color: "from-green-400 to-green-600",
      description: "Best for small amounts",
    },
    {
      value: "bKash",
      icon: "📱",
      color: "from-pink-400 to-pink-600",
      description: "Instant mobile payment",
    },
    {
      value: "Nagad",
      icon: "💳",
      color: "from-orange-400 to-orange-600",
      description: "Quick digital payment",
    },
    {
      value: "Bank",
      icon: "🏦",
      color: "from-blue-400 to-blue-600",
      description: "Secure bank transfer",
    },
    {
      value: "Other",
      icon: "💰",
      color: "from-purple-400 to-purple-600",
      description: "Other payment methods",
    },
  ];

  if (!purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with navigation */}
      
      <PurchasePaymentHeader purchase={purchase} savedDraft={savedDraft}/>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Purchase Summary - Improved */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <TbReceipt className="text-blue-600" />
                  Purchase Details
                </h2>
              </div>

              {/* Supplier Card */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TbUser className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {purchase.supplier?.name}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <TbPhone className="w-4 h-4" />
                      {purchase.supplier?.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-3">
                {[
                  { label: "Subtotal", value: purchase.total, type: "normal" },
                  {
                    label: "Discount",
                    value: `${purchase.discount} (${purchase.discountPercent}%)`,
                    type: "success",
                  },
                  {
                    label: "Transport",
                    value: purchase.transportCost,
                    type: "normal",
                  },
                  {
                    label: "Grand Total",
                    value: purchase.grandTotal,
                    type: "highlight",
                  },
                  { label: "Paid", value: purchase.paid, type: "info" },
                  { label: "Outstanding", value: purchase.due, type: "danger" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`flex justify-between items-center p-3 rounded-lg transition-all ${
                      item.type === "highlight"
                        ? "bg-blue-50 border border-blue-200 font-semibold"
                        : item.type === "danger"
                        ? "bg-red-50 border border-red-200 font-semibold"
                        : item.type === "success"
                        ? "bg-green-50"
                        : item.type === "info"
                        ? "bg-blue-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-slate-700">{item.label}</span>
                    <span
                      className={`flex items-center gap-1 ${
                        item.type === "danger"
                          ? "text-red-600"
                          : item.type === "success"
                          ? "text-green-600"
                          : item.type === "info"
                          ? "text-blue-600"
                          : "text-slate-800"
                      }`}
                    >
                      <TbCurrencyTaka className="w-4 h-4" />
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Due Date Warning */}
              {purchase.dueDate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <TbClock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        Payment Due
                      </p>
                      <p className="text-sm text-orange-600">
                        {new Date(purchase.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <TbHistory className="text-blue-600" />
                Payment History
              </h3>
              <div className="text-center py-8 text-slate-500">
                <TbInfoCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No previous payments</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Payment Form - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                  <TbCreditCard className="text-blue-600" />
                  Payment Form
                </h2>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isValid ? "bg-green-500" : "bg-slate-300"
                    }`}
                  ></div>
                  <span className="text-sm text-slate-600">
                    {isValid ? "Ready to submit" : "Fill required fields"}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {paymentSuccess ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <TbCheck className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-green-600 mb-3">
                      Payment Successful!
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Your payment has been processed successfully.
                    </p>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setShowReceipt(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <TbDownload className="w-5 h-5" />
                        Download Receipt
                      </button>
                      <button
                        onClick={() => navigate("/purchase")}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Back to Purchases
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="space-y-8"
                  >
                    {/* Quick Amount Selection */}
                    {showQuickAmounts && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <TbCalculator className="w-4 h-4" />
                            Quick Amount Selection
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setShowQuickAmounts(!showQuickAmounts)
                            }
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            {showQuickAmounts ? "Hide" : "Show"} Quick Options
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3 mb-6">
                          {quickAmounts.map((quick, index) => (
                            <motion.button
                              key={quick.label}
                              type="button"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              onClick={() => handleQuickAmount(quick.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                selectedQuickAmount === quick.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full mx-auto mb-2 bg-gradient-to-r ${quick.color} flex items-center justify-center`}
                              >
                                <TbPercentage className="w-4 h-4 text-white" />
                              </div>
                              <p className="text-sm font-medium text-slate-800">
                                {quick.label}
                              </p>
                              <p className="text-xs text-slate-600">
                                ৳{quick.value.toLocaleString()}
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Amount Input - Enhanced */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Payment Amount *
                      </label>
                      <div className="relative">
                        <TbCurrencyTaka className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
                        <input
                          type="number"
                          step="0.01"
                          className={`w-full pl-12 pr-4 input transition-all duration-200 ${
                            errors.amount
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : watchedAmount
                              ? "border-green-300 focus:border-green-500 focus:ring-green-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          } focus:ring-4`}
                          placeholder="0.00"
                          {...register("amount", {
                            required: "Amount is required",
                            validate: getAmountValidation,
                          })}
                        />

                        {/* Amount Status */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {watchedAmount && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2"
                            >
                              {watchedAmount <= purchase.due ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <TbCheck className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    Valid
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                  <TbInfoCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    Exceeds due
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Amount Info */}
                      {watchedAmount && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              Remaining after payment:
                            </span>
                            <span className="font-medium text-slate-800">
                              ৳
                              {Math.max(
                                0,
                                purchase.due - (Number(watchedAmount) || 0)
                              ).toLocaleString()}
                            </span>
                          </div>
                          {Number(watchedAmount) === purchase.due && (
                            <div className="flex items-center gap-1 text-green-600 mt-1">
                              <TbCheck className="w-4 h-4" />
                              <span className="text-sm">
                                This will fully settle the purchase
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {errors.amount && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          <TbInfoCircle className="w-4 h-4" />
                          {errors.amount.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Payment Method - Enhanced */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium text-slate-700 mb-4">
                        Payment Method *
                        {watchedAmount && (
                          <span className="ml-2 text-blue-600 text-xs">
                            <TbBulb className="inline w-3 h-3 mr-1" />
                            Recommended:{" "}
                            {getRecommendedMethod(Number(watchedAmount))}
                          </span>
                        )}
                      </label>

                      <div className="grid md:grid-cols-2 gap-4">
                        {paymentMethods.map((method, index) => (
                          <motion.label
                            key={method.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="relative cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={method.value}
                              {...register("method", {
                                required: "Select payment method",
                              })}
                              className="sr-only peer"
                            />
                            <div
                              className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                                watchedMethod === method.value
                                  ? "border-blue-500 bg-blue-50 scale-105"
                                  : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{method.icon}</span>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {method.value}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                              {watchedAmount &&
                                method.value ===
                                  getRecommendedMethod(
                                    Number(watchedAmount)
                                  ) && (
                                  <div className="absolute top-2 right-2">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <TbBulb className="w-3 h-3 text-white" />
                                    </div>
                                  </div>
                                )}
                            </div>
                          </motion.label>
                        ))}
                      </div>

                      {errors.method && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          <TbInfoCircle className="w-4 h-4" />
                          {errors.method.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Note Field - Enhanced */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Payment Note (Optional)
                      </label>
                      <textarea
                        rows={3}
                        {...register("note")}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-600 transition-all duration-200 resize-none outline-none"
                        placeholder="Add any additional notes about this payment..."
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        This note will appear on the payment record and receipt
                      </p>
                    </motion.div>

                    {/* Submit Button - Enhanced */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="pt-4"
                    >
                      <button
                        type="submit"
                        disabled={loading || !isValid}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                          loading || !isValid
                            ? "bg-slate-300 cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Payment...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <TbShieldCheck className="w-5 h-5" />
                            <span>Complete Secure Payment</span>
                            {watchedAmount && (
                              <span className="bg-white/20 px-2 py-1 rounded text-sm">
                                ৳{Number(watchedAmount).toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </button>

                      {!isValid && (
                        <p className="text-center text-sm text-slate-500 mt-2">
                          Please fill in all required fields to continue
                        </p>
                      )}
                    </motion.div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
