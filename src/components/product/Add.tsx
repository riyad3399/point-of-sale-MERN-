import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

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
  const [preview, setPreview] = useState<string | null>(null);
  const { token } = useAuth();

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Product added successfully!");
        reset();
        console.log("Saved product:", result);
      } else {
        toast.error(result.message || "Failed to add product!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong!");
    }
  };

  //  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //    const file = e.target.files?.[0];
  //    if (file) {
  //      const reader = new FileReader();
  //      reader.onloadend = () => setPreview(reader.result as string);
  //      reader.readAsDataURL(file);
  //    }
  //  };

  useEffect(() => {
    generateNumber();
    axios
      .get("http://localhost:3000/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAllCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, [token]);

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
              className="mt-1 w-full input"
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
              disabled
              className="mt-1 w-full input text-gray-600"
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
              className="mt-1 w-full input"
            >
              {allCategories.map((category, i) => (
                <option key={i} value={category.categoryName}>
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
              className="mt-1 w-full input"
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
              className="mt-1 w-full input"
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
              className="mt-1 w-full input"
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
              className="mt-1 w-full input"
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
              className="mt-1 w-full input"
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
              className="mt-1 w-full input"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.unit.label")}
            </label>
            <select {...register("unit")} className="mt-1 w-full input">
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
              className="mt-1 w-full input"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("addProduct.taxType.label")}
            </label>
            <select {...register("taxType")} className="mt-1 w-full input">
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
              className="mt-1 w-full input"
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
              className="mt-1 w-full input"
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
            className="mt-1 w-full input"
          />
        </motion.div>

        {/* Photo Upload */}
        <div>
          <input
            type="file"
            accept="image/*"
            {...register("photo")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }

              register("photo").onChange(e);
            }}
            className="block"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded"
            />
          )}
        </div>

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
