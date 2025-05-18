import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader } from "lucide-react";
import Swal from "sweetalert2";

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

  const onSubmit = async (data: Customer) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Customer added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: response.statusText,
          text: result.message,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-6 ring-2 ring-blue-500 p-6 rounded-2xl  max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("customerName", { required: "Name is required" })}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
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
            Phone
          </label>
          <input
            type="number"
            {...register("phone", { required: "Phone is required" })}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+880 1234-567890"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          {...register("address")}
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="123 Street Name, City"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        type="submit"
        disabled={loading}
        className={`w-full py-3  transition-all duration-300 ${
          loading ? "bg-blue-500 cursor-not-allowed" : "btn-primary"
        }`}
      >
        {loading ? (
          <span className="flex justify-center items-center gap-2">
            <Loader className="animate-spin h-5 w-5" />
            Processing...
          </span>
        ) : (
          "Add Customer"
        )}
      </motion.button>
    </motion.form>
  );
}
