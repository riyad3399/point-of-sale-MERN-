import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";


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

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product added successfully!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
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

  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>Add Product | POS System</title>
      </Helmet>
      <motion.h2
        variants={fieldVariants}
        className="text-2xl font-semibold text-gray-800 mb-6"
      >
        {t("addProduct.formTitle")}
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
              {t("addProduct.productName.label")} *
            </label>
            <input
              type="text"
              {...register("productName", {
                required: "Product Name is required",
              })}
              placeholder={t("addProduct.productName.placeholder")}
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
              {t("addProduct.productCode.label")}
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
              {t("addProduct.category.label")} *
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
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.brand.label")}
            </label>
            <input
              type="text"
              {...register("brand")}
              placeholder={t("addProduct.brand.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Prices and Quantity */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.purchasePrice.label")} *
            </label>
            <input
              type="number"
              {...register("purchasePrice", {
                required: "Purchase Price is required",
              })}
              placeholder={t("addProduct.purchasePrice.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.retailPrice.label")} *
            </label>
            <input
              type="number"
              {...register("retailPrice", {
                required: "Retail Price is required",
              })}
              placeholder={t("addProduct.retailPrice.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.wholesalePrice.label")} *
            </label>
            <input
              type="number"
              {...register("wholesalePrice", {
                required: "Wholesale Price is required",
              })}
              placeholder={t("addProduct.wholesalePrice.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.quantity.label")} *
            </label>
            <input
              type="number"
              {...register("quantity", { required: "Quantity is required" })}
              placeholder={t("addProduct.quantity.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Alert Quantity and Unit */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.alertQuantity.label")}
            </label>
            <input
              type="number"
              {...register("alertQuantity")}
              placeholder={t("addProduct.alertQuantity.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.unit.label")}
            </label>
            <select
              {...register("unit")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">{t("addProduct.unit.placeholder")}</option>
              <option value="pcs">Pcs</option>
              <option value="kg">Kg</option>
              <option value="ltr">Ltr</option>
            </select>
          </div>
        </motion.div>

        {/* Tax and Tax Type */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.tax.label")}
            </label>
            <input
              type="number"
              {...register("tax")}
              placeholder={t("addProduct.tax.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.taxType.label")}
            </label>
            <select
              {...register("taxType")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value=""> {t("addProduct.taxType.placeholder")}</option>
              <option value="inclusive">
                {t("addProduct.taxType.inclusive")}
              </option>
              <option value="exclusive">
                {t("addProduct.taxType.exclusive")}
              </option>
            </select>
          </div>
        </motion.div>
        {/* color & size */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.size.label")}
            </label>
            <input
              type="text"
              {...register("size")}
              placeholder={t("addProduct.size.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.color.label")}
            </label>
            <input
              type="text"
              {...register("color")}
              placeholder={t("addProduct.color.placeholder")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div variants={fieldVariants}>
          <label className="text-sm font-medium text-gray-700">
            {t("addProduct.description.label")}
          </label>
          <textarea
            {...register("description")}
            placeholder={t("addProduct.description.placeholder")}
            rows={3}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </motion.div>

        {/* Photo Upload */}
        <motion.div variants={fieldVariants}>
          <label className="text-sm font-medium text-gray-700">
            {t("addProduct.photo.label")}
          </label>
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
            {t("addProduct.submitButton")}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Add;
