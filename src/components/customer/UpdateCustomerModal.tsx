import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

interface Customer {
  _id: string;
  customerName: string;
  phone: string;
  address?: string;
}

interface Props {
  customer: Customer;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onClose: () => void;
}

export default function UpdateCustomerModal({
  customer,
  setCustomers,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      customerName: customer.customerName,
      phone: customer.phone,
      address: customer.address || "",
    },
  });

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Update on submit
  const onSubmit = async (data: any) => {
    try {
      await axios
        .patch(`http://localhost:3000/customer/${customer._id}`, data)
        .then((res) => {
          const updatedCustomer = res.data;

          setCustomers((prev) =>
            prev.map((cus) =>
              cus._id === customer._id ? updatedCustomer : cus
            )
          );
          Swal.fire({
            title: "Customer Update Successfull!",
            icon: "success",
            draggable: true,
          });
          console.log(res.data);
          onClose();
          reset();
        });
    } catch (err) {
      console.error("Error updating customer:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            onClick={onClose}
          >
            <IoMdClose size={24} />
          </button>

          <h2 className="text-xl font-semibold mb-4">Update Customer</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("customerName", { required: "Name is required" })}
              placeholder="Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm">
                {errors.customerName.message}
              </p>
            )}

            <input
              {...register("phone", { required: "Phone is required" })}
              placeholder="Phone"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}

            <input
              {...register("address")}
              placeholder="Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
