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
    try {
      const response = await fetch("http://localhost:3000/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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
          title: "Oops...",
          text: "Failed to add Customer!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-5"
    >
      <div className="flex gap-6">
        {/* Name */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("customerName", { required: "Name is required" })}
            className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            {...register("phone", { required: "Phone is required" })}
            className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+880 1234-567890"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
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
          className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="123 Street Name, City"
          rows={3}
        />
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
      >
        {loading ? (
          <span className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </span>
        ) : (
          "Add Customer"
        )}
      </motion.button>
    </motion.form>
  );
}
