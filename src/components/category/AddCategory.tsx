import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";


type FormValues = {
  categoryId: number;
  categoryName: string;
};

const AddCategory: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [randomNumber, setRandomNumber] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const {token} = useAuth()

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryName: data.categoryName,
        }),
      });

      if (response.ok) {
        toast.success("Category added successfully!");
        reset();
      } else {
       toast.error("Failed to add Category!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const {t} = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className=" rounded-2xl p-6 md:w-[50%] mx-auto shadow-md"
    >
      <Helmet>
        <title>Add Category | POS System</title>
      </Helmet>
      <form onSubmit={handleSubmit(handleCategorySubmit)} className="space-y-5">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("category.id_label")}
            </label>
            <input
              type="number"
              readOnly
              {...register("categoryId")}
              value={randomNumber}
              className="mt-2 w-full p-3 input transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("category.name_label")}
            </label>
            <input
              type="text"
              placeholder={t("category.name_label")}
              {...register("categoryName", { required: true })}
              className="mt-2 w-full input transition duration-300"
            />
          </div>
        </div>

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
              {t("category.processing")}
            </span>
          ) : (
            t("category.submit")
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddCategory;
