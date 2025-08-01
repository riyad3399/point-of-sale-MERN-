import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface SupplierFormData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

const SupplierAddForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>();

  const onSubmit = async (data: SupplierFormData) => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/suppliers/add", data);

      if (res.status === 201) {
        toast.success(res.data?.message || "Supplier Added!");
        reset();
      } else {
        toast.error(res.data?.message || "something went wrong");
        reset();
      }
    } catch (err) {
      console.error("Error adding supplier:", err);
      const errorMsg =
        err.response?.data?.message || "Supplier যোগ করতে সমস্যা হয়েছে।";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-lg w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Supplier Name */}
        <motion.div
          className="flex flex-col"
          variants={inputVariants}
          custom={0}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t("supplier.supplierName")} <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="px-4 py-3 input dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-white transition-all duration-300 ease-in-out outline-none shadow-sm hover:shadow-md"
            placeholder={t("supplier.enterSupplierName")}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-sm text-red-500 font-medium mt-1" role="alert">
              {errors.name.message}
            </p>
          )}
        </motion.div>

        {/* Phone Number */}
        <motion.div
          className="flex flex-col"
          variants={inputVariants}
          custom={1}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t("supplier.phoneNumber")}
          </label>
          <input
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^01[3-9]\d{8}$/,
                message: "Invalid Bangladeshi phone number",
              },
            })}
            className="px-4 py-3 input dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-white transition-all duration-300 ease-in-out outline-none shadow-sm hover:shadow-md"
            placeholder={t("supplier.enterPhoneNumber")}
          />
          {/* Optionally display phone validation errors */}
          {errors.phone && (
            <p className="text-sm text-red-500 font-medium mt-1">
              {errors.phone.message}
            </p>
          )}
        </motion.div>
        {/* email Number */}
        <motion.div
          className="flex flex-col"
          variants={inputVariants}
          custom={1}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t("supplier.email")}
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email",
              },
            })}
            className="px-4 py-3 input dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-white transition-all duration-300 ease-in-out outline-none shadow-sm hover:shadow-md"
            placeholder={t("supplier.enterEmail")}
          />
          {/* Optionally display phone validation errors */}
          {errors.email && (
            <p className="text-sm text-red-500 font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </motion.div>

        {/* Address */}
        <motion.div
          className="flex flex-col"
          variants={inputVariants}
          custom={2}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t("supplier.address")}
          </label>
          <textarea
            {...register("address")}
            rows={3}
            className="px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
           disabled:cursor-not-allowed disabled:opacity-50 rounded-md border border-gray-300 dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-white resize-none transition-all duration-300 ease-in-out outline-none shadow-sm hover:shadow-md"
            placeholder={t("supplier.enterAddress")}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
          variants={inputVariants}
          custom={3}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V4C6.477 4 4 6.477 4 9v1z"
                ></path>
              </svg>
              <span>Processing...</span>
            </div>
          ) : (
            t("supplier.saveSupplier")
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SupplierAddForm;

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
};

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    // i is the index for delay
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1, // Staggered delay
      duration: 0.3,
      ease: "easeIn",
    },
  }),
};
