import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

// interface Category {
//   id: number;
//   categoryName: string;
//   status: "Active" | "Inactive" | "Pending";
// }

interface CategoryUpdateModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  categoryName: string;
  status: "Active" | "Inactive" | "Pending";
}

export default function CategoryUpdateModal({
  open,
  onClose,
  product,
  setCategories,
}: CategoryUpdateModalProps) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      categoryName: product?.categoryName || "",
      status: product?.status || "Pending",
    },
  });

  const onSubmit = async (data) => {
    try {
      await axios
        .patch(`http://localhost:3000/category/${product._id}`, data)
        .then((res) => {
          const updatedCategory = res.data;

          setCategories((prev) =>
            prev.map((cat) => (cat._id === product._id ? updatedCategory : cat))
          );
          Swal.fire({
            title: "Category Update Successfull!",
            icon: "success",
            draggable: true,
          });
          console.log(res.data);
          onClose();
          reset();
        });
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4">Update Category</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  {...register("categoryName", { required: true })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  {...register("status")}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
