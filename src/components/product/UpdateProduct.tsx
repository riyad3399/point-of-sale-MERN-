import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Product } from "../../types";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface CategoryType {
  categoryId: string;
  categoryName: string;
}

interface UpdateProductProps {
  product: Product;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const container = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.03 } },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const UpdateProduct: React.FC<UpdateProductProps> = ({
  product,
  setIsOpen,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;

  const [preview, setPreview] = useState<string | null>(null);
  const watchedPhoto = watch("photo");

  useEffect(() => {
    if (watchedPhoto && watchedPhoto[0]) {
      const file = watchedPhoto[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedPhoto]);

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName || "",
        productCode: product.productCode || "",
        category: product.category || "",
        brand: product.brand || "",
        purchasePrice: product.purchasePrice || "",
        retailPrice: product.retailPrice || "",
        wholesalePrice: product.wholesalePrice || "",
        quantity: product.quantity || "",
        alertQuantity: product.alertQuantity || "",
        unit: product.unit || "",
        tax: product.tax || "",
        taxType: product.taxType || "",
        size: product.size || "",
        color: product.color || "",
        description: product.description || "",
      });

      if ((product as any)?.photoUrl) {
        setPreview((product as any).photoUrl);
      }
    }
  }, [product, reset]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchCategory();
  }, [token, BASE_URL]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // append normal fields
      for (const key in data) {
        if (key !== "photo") {
          formData.append(key, data[key] ?? "");
        }
      }

      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      const response = await fetch(`${BASE_URL}/product/${product._id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Product updated successfully!");
        reset(data);
        setIsOpen(false);
      } else {
        toast.error(result.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[480px] bg-white rounded-2xl overflow-hidden">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 lg:p-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="col-span-1 bg-gradient-to-b from-white to-gray-50 rounded-xl p-4 flex flex-col items-center gap-4"
          variants={fieldVariant}
        >
          <div className="w-full flex items-center justify-between">
            <h3 className="text-lg font-semibold">Product Preview</h3>
            <span className="text-xs text-gray-500">ID: {product.productCode}</span>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-40 h-40 rounded-xl overflow-hidden bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl">🖼️</div>
                  <div className="text-xs mt-1">No image uploaded</div>
                </div>
              )}
            </div>

            <label className="w-full">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-left">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm">
                      {watchedPhoto && watchedPhoto[0]
                        ? watchedPhoto[0].name
                        : preview
                        ? "Current image shown"
                        : "Click to upload or drag & drop"}
                    </span>
                    <span className="ml-3 text-xs text-gray-500 group-hover:text-gray-700">
                      PNG, JPG • max 10MB
                    </span>
                  </div>
                </div>
              </div>
            </label>

            <div className="w-full text-xs text-gray-500 text-center">
              Tip: Upload a clear square image for best results.
            </div>
          </div>

          <div className="w-full mt-4 text-sm text-gray-600">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">SKU</span>
                <span className="text-sm text-gray-500">
                  {product.productCode || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Stock</span>
                <span className="text-sm text-gray-500">
                  {product.quantity ?? 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right / Middle column - Main form fields */}
        <motion.div className="col-span-2 space-y-4" variants={fieldVariant}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Product Name
              </label>
              <input
                type="text"
                {...register("productName", {
                  required: "Product Name is required",
                })}
                onFocus={() => setFocusedField("productName")}
                onBlur={() => setFocusedField(null)}
                className={`w-full input px-4 py-2 rounded-lg border transition-shadow duration-150 placeholder-gray-400 bg-white ${
                  errors.productName
                    ? "border-red-400 shadow-outline-red"
                    : focusedField === "productName"
                    ? "ring-2 ring-primary-300 shadow-sm"
                    : "border-gray-200"
                }`}
                placeholder="Enter product name"
              />
              <AnimatePresence>
                {errors.productName && (
                  <motion.p
                    className="text-red-500 text-sm mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {errors.productName.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Category
              </label>
              <select
                {...register("category")}
                onFocus={() => setFocusedField("category")}
                onBlur={() => setFocusedField(null)}
                className={`w-full input px-4 py-2 rounded-lg border transition duration-150 bg-white ${
                  focusedField === "category"
                    ? "ring-2 ring-green-200"
                    : "border-gray-200"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option
                    key={cat.categoryId ?? cat._id}
                    value={cat.categoryName ?? cat.name}
                  >
                    {cat.categoryName ?? cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Brand
              </label>
              <input
                type="text"
                {...register("brand")}
                onFocus={() => setFocusedField("brand")}
                onBlur={() => setFocusedField(null)}
                className={`w-full input px-3 py-2 rounded-lg border ${
                  focusedField === "brand"
                    ? "ring-2 ring-primary-200"
                    : "border-gray-200"
                }`}
                placeholder="Brand name"
              />
            </div>

            {/** Pricing inputs */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Purchase
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("purchasePrice")}
                  onFocus={() => setFocusedField("purchasePrice")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full input pl-8 pr-3 py-2 rounded-lg border ${
                    focusedField === "purchasePrice"
                      ? "ring-2 ring-purple-200"
                      : "border-gray-200"
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Retail
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("retailPrice")}
                  onFocus={() => setFocusedField("retailPrice")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full input pl-8 pr-3 py-2 rounded-lg border ${
                    focusedField === "retailPrice"
                      ? "ring-2 ring-purple-200"
                      : "border-gray-200"
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Quantity
              </label>
              <input
                type="number"
                {...register("quantity", { required: "Quantity is required" })}
                onFocus={() => setFocusedField("quantity")}
                onBlur={() => setFocusedField(null)}
                className={`w-full input px-3 py-2 rounded-lg border ${
                  focusedField === "quantity"
                    ? "ring-2 ring-primary-200"
                    : "border-gray-200"
                }`}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Alert Qty
              </label>
              <input
                type="number"
                {...register("alertQuantity")}
                onFocus={() => setFocusedField("alertQuantity")}
                onBlur={() => setFocusedField(null)}
                className={`w-full input px-3 py-2 rounded-lg border ${
                  focusedField === "alertQuantity"
                    ? "ring-2 ring-primary-200"
                    : "border-gray-200"
                }`}
                placeholder="Min stock"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Unit
              </label>
              <select
                {...register("unit")}
                onFocus={() => setFocusedField("unit")}
                onBlur={() => setFocusedField(null)}
                className={`w-full input px-3 py-2 rounded-lg border ${
                  focusedField === "unit"
                    ? "ring-2 ring-orange-200"
                    : "border-gray-200"
                }`}
              >
                <option value="">Select unit</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ltr">Liters (ltr)</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Wholesale
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("wholesalePrice")}
                  onFocus={() => setFocusedField("wholesalePrice")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full input pl-8 pr-3 py-2 rounded-lg border ${
                    focusedField === "wholesalePrice"
                      ? "ring-2 ring-purple-200"
                      : "border-gray-200"
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Tax (%)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("tax")}
                className="w-full input px-3 py-2 rounded-lg border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Tax Type
              </label>
              <select
                {...register("taxType")}
                className="w-full input px-3 py-2 rounded-lg border border-gray-200"
              >
                <option value="">Select tax type</option>
                <option value="inclusive">Inclusive</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Size
              </label>
              <input
                type="text"
                {...register("size")}
                className="w-full input px-3 py-2 rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Color
            </label>
            <input
              type="text"
              {...register("color")}
              className="w-full input px-3 py-2 rounded-lg border border-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={2}
              onFocus={() => setFocusedField("description")}
              onBlur={() => setFocusedField(null)}
              className={`w-full input px-4 py-3 rounded-lg border transition duration-150 resize-none ${
                focusedField === "description"
                  ? "ring-2 ring-primary-200"
                  : "border-gray-200"
              }`}
              placeholder="Describe the product..."
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className={`btn-primary px-6 py-2 rounded-lg shadow-md flex items-center gap-3 ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <span className="spinner-border animate-spin inline-block h-4 w-4 border-2 rounded-full" />
                  Updating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v6h6M20 20v-6h-6"
                    />
                  </svg>
                  <span>Update Product</span>
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default UpdateProduct;
