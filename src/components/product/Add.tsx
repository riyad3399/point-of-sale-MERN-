import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const Add: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number | undefined>();
  const [allCategories, setAllCategories] = useState<never[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const generateNumber = () => {
    const number = Math.floor(Math.random() * 900000) + 100000;
    setRandomNumber(number);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Append regular fields
      for (const key in data) {
        if (key !== "photo") {
          formData.append(key, data[key]);
        }
      }

      // Append file if exists
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      const response = await fetch("http://localhost:3000/product", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add product!",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    generateNumber();
    axios
      .get("http://localhost:3000/category")
      .then((res) => {
        setAllCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <motion.h2
        variants={fieldVariants}
        className="text-2xl font-semibold text-gray-800 mb-6"
      >
        Add New Product
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Product Name and Product Code */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              {...register("productName", {
                required: "Product Name is required",
              })}
              placeholder="e.g. Apple iPhone 15"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.productName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex justify-between">
              Product Code / SKU
            </label>
            <input
              type="text"
              {...register("productCode")}
              value={randomNumber}
              readOnly
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
            />
          </div>
        </motion.div>

        {/* Category and Brand */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {allCategories.map((category) => (
                <option value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              {...register("brand")}
              placeholder="e.g. Apple"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Prices and Quantity */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Price (ক্রয় মূল্য) *
            </label>
            <input
              type="number"
              {...register("purchasePrice", {
                required: "Purchase Price is required",
              })}
              placeholder="e.g. 999.99"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Retail Price (খুচরা মূল্য) *
            </label>
            <input
              type="number"
              {...register("retailPrice", {
                required: "Retail Price is required",
              })}
              placeholder="e.g. 1099.99"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Wholesale Price (পাইকারি মূল্য) *
            </label>
            <input
              type="number"
              {...register("wholesalePrice", {
                required: "Wholesale Price is required",
              })}
              placeholder="e.g. 950.00"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity (পরিমাণ) *
            </label>
            <input
              type="number"
              {...register("quantity", { required: "Quantity is required" })}
              placeholder="e.g. 100"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Alert Quantity and Unit */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Alert Quantity (সতর্কীকরণ)
            </label>
            <input
              type="number"
              {...register("alertQuantity")}
              placeholder="e.g. 10"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Unit (একক)
            </label>
            <select
              {...register("unit")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="pcs">Pcs</option>
              <option value="kg">Kg</option>
              <option value="ltr">Ltr</option>
            </select>
          </div>
        </motion.div>

        {/* Tax and Tax Type */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">Tax (%)</label>
            <input
              type="number"
              {...register("tax")}
              placeholder="tax %"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Tax Type
            </label>
            <select
              {...register("taxType")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="inclusive">Inclusive</option>
              <option value="exclusive">Exclusive</option>
            </select>
          </div>
        </motion.div>
        {/* color & size */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
             Size
            </label>
            <input
              type="text"
              {...register("size")}
              placeholder="Product Size"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="text"
              {...register("color")}
              placeholder="Product Color"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div variants={fieldVariants}>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Write a short product description..."
            rows={3}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </motion.div>

        {/* Photo Upload */}
        <motion.div variants={fieldVariants}>
          <label className="text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            {...register("photo")}
            className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={fieldVariants}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full  text-white py-3 rounded-xl font-semibold btn-primary transition duration-200"
          >
            Add Product
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Add;
