import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Loader } from "lucide-react";

type FormValues = {
  categoryId: number;
  categoryName: string;
};

const AddCategory: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [randomNumber, setRandomNumber] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);


  const handleGenerateNumber = () => {
    const number = Math.floor(Math.random() * 900000) + 100000;
    setRandomNumber(number);
  };

  useEffect(() => {
    handleGenerateNumber();
  }, []);

  const handleCategorySubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: data.categoryName,
        }),
      });

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Category added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add Category!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className=" rounded-2xl p-6 w-full mx-auto "
    >
      <form onSubmit={handleSubmit(handleCategorySubmit)} className="space-y-5">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category ID
            </label>
            <input
              type="number"
              readOnly
              {...register("categoryId")}
              value={randomNumber}
              className="mt-2 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Category Name"
              {...register("categoryName", { required: true })}
              className="mt-2 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            />
          </div>
        </div>

       
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
            "Add Category"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddCategory;
