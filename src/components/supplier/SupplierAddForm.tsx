import React, { useState } from "react"; // Import useState and React
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // Import framer-motion

// Interface definition remains the same
interface SupplierFormData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

const SupplierAddForm = () => {
  // State to handle loading status for the button/API call
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted, isSubmitting }, // isSubmitting can also be used, but managing state manually gives more control over UI
  } = useForm<SupplierFormData>();

  const onSubmit = async (data: SupplierFormData) => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/suppliers/add", data);

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: res.data?.message || "Supplier Added!",
          text: "নতুন সাপ্লায়ার সফলভাবে যুক্ত হয়েছে।",
          iconColor: "#3085d6", 
          confirmButtonColor: "#3085d6",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        reset(); // Reset form fields
      } else {
        // Handle cases where status is not 201 but request succeeded (optional)
        Swal.fire({
          icon: "warning",
          title:  "Operation Completed",
          text: `Supplier added with status: ${res.status}.`,
          confirmButtonColor: "#3085d6",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        reset();
      }
    } catch (err) {
      console.error("Error adding supplier:", err);
      const errorMsg =
        err.response?.data?.message || "Supplier যোগ করতে সমস্যা হয়েছে।";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
        iconColor: "#d33",
        confirmButtonColor: "#d33",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Apply framer-motion animation to the container
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
            Supplier Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="px-4 py-3 input dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-white transition-all duration-300 ease-in-out outline-none shadow-sm hover:shadow-md"
            placeholder="Enter supplier name"
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
            Phone Number
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
            placeholder="013XXXXXXXX"
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
            Email
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
            placeholder="demo@gmail.com"
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
            Address
          </label>
          <textarea
            {...register("address")}
            rows={3}
            className="px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
           disabled:cursor-not-allowed disabled:opacity-50 rounded-md border border-gray-300 dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-white resize-none transition-all duration-300 ease-in-out outline-none shadow-sm hover:shadow-md"
            placeholder="e.g., 123, Badda, Dhaka"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading} // Disable button when loading
          variants={inputVariants} // Reuse input variants for stagger
          custom={3} // Last item in the sequence
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
            "Save Supplier"
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
