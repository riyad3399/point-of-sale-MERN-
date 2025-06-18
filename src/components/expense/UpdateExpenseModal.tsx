import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { updateExpense } from "../../utils/api";
import Swal from "sweetalert2";

interface Item {
  category?: string;
  remarks?: string;
  unitPrice: number;
  quantity: number;
}

interface ExpenseFormData {
  date: string;
  method: "CASH" | "BKASH" | "BANK";
  items: Item[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    _id: string;
    date: string;
    method: string;
    items: Item[];
  };
  onUpdated: () => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

export default function UpdateExpenseModal({
  isOpen,
  onClose,
  expense,
  onUpdated,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      date: expense.date,
      method: expense.method as "CASH" | "BKASH" | "BANK",
      items: expense.items,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      await updateExpense(expense._id, data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Expense updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
        >
          <motion.div
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 relative overflow-auto max-h-[90vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition duration-200"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Update Expense
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    {...register("date", { required: "Date is required" })}
                    className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-primary-500 focus:ring-2 ring-1"
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Method
                  </label>
                  <select
                    {...register("method")}
                    className="w-full border rounded-md px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-primary-500 focus:ring-2 ring-1"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BKASH">Bkash</option>
                    <option value="BANK">Bank</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {fields.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-100 p-3 rounded-lg border border-gray-300"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <input
                      placeholder="Category"
                      {...register(`items.${index}.category`)}
                      className="border rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-primary-500 focus:ring-2 ring-1"
                    />
                    <input
                      placeholder="Remarks"
                      {...register(`items.${index}.remarks`)}
                      className="border rounded px-2 py-1 text-gray-700 focus:outline-none  focus:ring-primary-500 focus:ring-2 ring-1"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      {...register(`items.${index}.unitPrice`, {
                        required: true,
                        min: 0,
                      })}
                      className="border rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-primary-500 focus:ring-2 ring-1"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Quantity"
                        {...register(`items.${index}.quantity`, {
                          required: true,
                          min: 1,
                        })}
                        className="border rounded px-2 py-1 w-full text-gray-700 focus:outline-none focus:ring-primary-500 focus:ring-2 ring-1"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 transition duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    append({
                      category: "",
                      remarks: "",
                      unitPrice: 0,
                      quantity: 1,
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  + Add Item
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Update Expense
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
