import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader } from "lucide-react";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface Customer {
  customerName: string;
  phone: string;
  address?: string;
}

export default function AddCustomer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Customer>();
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;


  const onSubmit = async (data: Customer) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          customerName: data.customerName.trim(),
          phone: data.phone.trim(),
          address: data.address?.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Customer added successfully!");
        reset();
      } else {
        toast.error(result.message || "Failed to add customer.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation();

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-6 shadow-md p-6 rounded-md w-fit mx-auto bg-white"
    >
      <Helmet>
        <title>Add Customer | POS System</title>
      </Helmet>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("customers.name")}
          </label>
          <input
            {...register("customerName", { required: "Name is required" })}
            className="mt-1 w-full input"
            placeholder={t("customers.placeholderName")}
          />
          {errors.customerName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.customerName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("customers.phone")}
          </label>
          <input
            type="text"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^01[3-9]\d{8}$/,
                message: "Invalid Bangladeshi phone number",
              },
            })}
            className="mt-1 w-full input"
            placeholder={t("customers.placeholderPhone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t("customers.address")}
        </label>
        <textarea
          {...register("address")}
          className="mt-1 w-full px-4 py-3 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
           disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
          placeholder={t("customers.placeholderAddress")}
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        type="submit"
        disabled={loading}
        className={`w-full py-2.5  transition-all duration-300 ${
          loading ? "bg-blue-500 cursor-not-allowed" : "btn-primary"
        }`}
      >
        {loading ? (
          <span className="flex justify-center items-center gap-2">
            <Loader className="animate-spin h-5 w-5" />
            Processing...
          </span>
        ) : (
          t("customers.addCustomer")
        )}
      </motion.button>
    </motion.form>
  );
}
