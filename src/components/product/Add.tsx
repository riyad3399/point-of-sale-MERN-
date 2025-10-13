import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "lucide-react";

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.04 },
  },
};

const Add: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number | undefined>();
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const BASE_URL = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    const number = Math.floor(Math.random() * 900000) + 100000;
    setRandomNumber(number);

    // fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchCategories();
  }, [BASE_URL, token]);

  // watch file input to show preview if the user selects a file from native dialog
  const watchedPhoto = watch("photo");
  useEffect(() => {
    if (watchedPhoto && watchedPhoto[0]) {
      const url = URL.createObjectURL(watchedPhoto[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedPhoto]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setValue("photo", [file]);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key !== "photo") {
          formData.append(key, data[key]);
        }
      }

      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      const response = await fetch(`${BASE_URL}/product`, {
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
        setPreview(null);
      } else {
        toast.error(result.message || "Failed to add product!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>Add Product | POS System</title>
      </Helmet>

      <motion.div variants={fieldVariants} initial="hidden" animate="visible">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {t("addProduct.formTitle")}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {t("addProduct.formSubtitle") || "Add a new product to your catalog"}
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="lg:col-span-4 col-span-1 bg-gradient-to-b from-white to-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4"
          variants={fieldVariants}
        >
         

          <div className="w-full flex items-center justify-center">
            <div className="w-48 h-48 rounded-xl bg-white border border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-300">
                  <div className="text-5xl">🖼️</div>
                  <div className="text-xs mt-1">No image</div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full text-sm text-gray-600">
            <div className="flex items-center justify-between py-2 border-b border-dashed border-gray-100">
              <span className="font-medium">SKU</span>
              <span className="text-sm text-gray-500">{randomNumber}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dashed border-gray-100">
              <span className="font-medium">Stock</span>
              <span className="text-sm text-gray-500">0</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-medium">Status</span>
              <span className="text-sm text-green-600">Draft</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Tip: Use a clear product image and meaningful name. You can drag
            &amp; drop an image into the upload area.
          </div>
        </motion.div>

        {/* form column */}
        <motion.div
          className="lg:col-span-8 col-span-1 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
          variants={fieldVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.productName.label")} *
              </label>
              <input
                type="text"
                {...register("productName", {
                  required: "Product Name is required",
                })}
                placeholder={t("addProduct.productName.placeholder")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              />
              {errors.productName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.productCode.label")}
              </label>
              <input
                type="text"
                {...register("productCode")}
                value={randomNumber}
                readOnly
                disabled
                className="mt-1 w-full input px-4 py-2 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.category.label")} *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              >
                <option value="">Select category</option>
                {allCategories.map((c, i) => (
                  <option
                    key={c.categoryId ?? c._id ?? i}
                    value={c.categoryName ?? c.name}
                  >
                    {c.categoryName ?? c.name}
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
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.brand.label")}
              </label>
              <input
                type="text"
                {...register("brand")}
                placeholder={t("addProduct.brand.placeholder")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.purchasePrice.label")} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("purchasePrice", {
                    required: "Purchase Price is required",
                  })}
                  placeholder={t("addProduct.purchasePrice.placeholder")}
                  className="mt-1 w-full input pl-10 py-2 rounded-lg"
                />
              </div>
              {errors.purchasePrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purchasePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.retailPrice.label")} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("retailPrice", {
                    required: "Retail Price is required",
                  })}
                  placeholder={t("addProduct.retailPrice.placeholder")}
                  className="mt-1 w-full input pl-10 py-2 rounded-lg"
                />
              </div>
              {errors.retailPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.retailPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.wholesalePrice.label")} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("wholesalePrice", {
                    required: "Wholesale Price is required",
                  })}
                  placeholder={t("addProduct.wholesalePrice.placeholder")}
                  className="mt-1 w-full input pl-10 py-2 rounded-lg"
                />
              </div>
              {errors.wholesalePrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.wholesalePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.quantity.label")} *
              </label>
              <input
                type="number"
                {...register("quantity", { required: "Quantity is required" })}
                placeholder={t("addProduct.quantity.placeholder")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.alertQuantity.label")}
              </label>
              <input
                type="number"
                {...register("alertQuantity")}
                placeholder={t("addProduct.alertQuantity.placeholder")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.unit.label")}
              </label>
              <select
                {...register("unit")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              >
                <option value="">{t("addProduct.unit.placeholder")}</option>
                <option value="pcs">Pcs</option>
                <option value="kg">Kg</option>
                <option value="ltr">Ltr</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.tax.label")}
              </label>
              <input
                type="number"
                {...register("tax")}
                placeholder={t("addProduct.tax.placeholder")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.taxType.label")}
              </label>
              <select
                {...register("taxType")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              >
                <option value="">{t("addProduct.taxType.placeholder")}</option>
                <option value="inclusive">
                  {t("addProduct.taxType.inclusive")}
                </option>
                <option value="exclusive">
                  {t("addProduct.taxType.exclusive")}
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.size.label")}
              </label>
              <input
                type="text"
                {...register("size")}
                placeholder={t("addProduct.size.placeholder")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.color.label")}
              </label>
              <input
                type="text"
                {...register("color")}
                placeholder={t("addProduct.color.placeholder")}
                className="mt-1 w-full input px-4 py-2 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600">
                {t("addProduct.description.label")}
              </label>
              <textarea
                {...register("description")}
                placeholder={t("addProduct.description.placeholder")}
                rows={3}
                className="mt-1 w-full input px-4 py-2 rounded-lg resize-none"
              />
            </div>

            {/* Upload area */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-2">
                Photo
              </label>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                className={`w-full rounded-lg border-2 border-dashed p-4 flex items-center gap-4 justify-between transition-colors ${
                  dragOver
                    ? "border-green-300 bg-green-50/40"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                    📁
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">
                      Drag &amp; drop or click to upload
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF • up to 10MB
                    </div>
                  </div>
                </div>

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
                    }}
                    className="hidden"
                    id="product-photo"
                  />
                  <label
                    htmlFor="product-photo"
                    className="btn-primary px-3 py-2 rounded-md cursor-pointer"
                  >
                    Select File
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
            >
              Reset
            </button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium btn-primary flex items-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                t("addProduct.submitButton")
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Add;
