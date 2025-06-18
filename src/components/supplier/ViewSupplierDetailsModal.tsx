import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, MapPin, Calendar, Hash } from "lucide-react";
import React from "react";
import { Supplier } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const modal = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 300 },
  },
};

const ViewSupplierDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  supplier,
}) => {
  if (!supplier) return null;

  const supplierFields = [
    { icon: Hash, label: "Supplier ID", value: supplier.supplierId },
    { icon: User, label: "Name", value: supplier.name },
    { icon: Phone, label: "Phone", value: supplier.phone || "Not provided" },
    { icon: Mail, label: "Email", value: supplier.email || "Not provided" },
    {
      icon: MapPin,
      label: "Address",
      value: supplier.address || "Not provided",
    },
    {
      icon: Calendar,
      label: "Added",
      value: supplier.createdAt
        ? new Date(supplier.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Not available",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 "
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden max-h-[95vh]"
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 relative">
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  Supplier Details
                </h2>
                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto"></div>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="p-8 space-y-6"
            >
              {supplierFields.map((field, index) => (
                <motion.div
                  key={field.label}
                  variants={itemVariants}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                    <field.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {field.label}
                    </p>
                    <p className="text-gray-900 font-medium break-words">
                      {field.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

           
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewSupplierDetailsModal;
