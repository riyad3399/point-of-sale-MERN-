import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TbArrowLeft, TbDeviceFloppy, TbShieldCheck } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function PurchasePaymentHeader({ savedDraft, purchase }) {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-lg border-b border-white/20 z-10 transition-all duration-300 ${
        isSticky ? "relative" : "sticky top-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/purchase")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <TbArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Payment Processing
              </h1>
              <p className="text-sm text-slate-600">
                Invoice #{purchase.invoiceNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedDraft && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                <TbDeviceFloppy className="w-4 h-4" />
                Draft Saved
              </motion.div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              <TbShieldCheck className="w-4 h-4" />
              Secure Payment
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
