import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { Product } from "../../types";

interface CategoryType {
  categoryId: string;
  categoryName: string;
}



interface UpdateProductProps {
  product: Product;
}

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
  loading: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

const UpdateProduct: React.FC<UpdateProductProps> = ({ product }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);



  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();

      for (const key in data) {
        if (key !== "photo") {
          formData.append(key, data[key]);
        }
      }

      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      const response = await fetch(
        `http://localhost:3000/product/${product._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: "Success!",
          text: result.message || "Product updated successfully.",
          icon: "success",
          confirmButtonColor: "#10B981",
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
        reset(data);
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || "Failed to update product.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Network Error!",
        text: "Please check your connection and try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get("http://localhost:3000/category");
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategory();
  }, []);

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
    }
  }, [product, reset]);

  return (
    <div className=" min-h-screen bg-white">
      <motion.div
        className="max-w-7xl mx-auto"
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className=" rounded-3xl overflow-hidden w-full"
          variants={cardVariants}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className=" border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="productName"
                  >
                    Product Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="productName"
                      {...register("productName", {
                        required: "Product Name is required",
                      })}
                      onFocus={() => setFocusedField("productName")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full input ${
                        errors.productName
                          ? "border-red-500 focus:ring-red-500"
                          : focusedField === "productName"
                          ? "ring-primary-500 shadow-md"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter product name"
                    />
                    <AnimatePresence>
                      {errors.productName && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.productName.message}
                        </p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="productCode"
                  >
                    Product Code / SKU
                  </label>
                  <input
                    type="text"
                    id="productCode"
                    {...register("productCode")}
                    readOnly
                    className="w-full input "
                    disabled
                    placeholder="Auto-generated"
                  />
                </div>
              </div>
            </div>

            {/* Category & Brand Section */}
            <div className="">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    onFocus={() => setFocusedField("category")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "category"
                        ? "border-primary-500 bg-green-50/50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 focus:border-green-400"
                    } focus:outline-none`}
                  >
                    <option value="">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Brand
                  </label>
                  <input
                    type="text"
                    {...register("brand")}
                    onFocus={() => setFocusedField("brand")}
                    onBlur={() => setFocusedField(null)}
                    className={`input ${
                      focusedField === "brand"
                        ? "border-primary-500 bg-green-50/50 shadow-lg"
                        : "border-gray-200 focus:ring-2"
                    } `}
                    placeholder="Enter brand name"
                  />
                </motion.div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["purchasePrice", "retailPrice", "wholesalePrice"].map(
                  (field) => (
                    <div key={field} className="space-y-2">
                      <label
                        className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                        htmlFor={field}
                      >
                        {field.replace(/Price/g, "")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                          $
                        </span>
                        <input
                          type="number"
                          id={field}
                          step="0.01"
                          {...register(field, {
                            required: `${field} is required`,
                          })}
                          onFocus={() => setFocusedField(field)}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full input pl-6 ${
                            errors[field as keyof typeof errors]
                              ? "border-red-500 focus:ring-red-500"
                              : focusedField === field
                              ? "ring-purple-500 shadow-md"
                              : "border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                        <AnimatePresence>
                          {errors[field as keyof typeof errors] && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors[field as keyof typeof errors]?.message}
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Inventory & Units */}
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="quantity"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    {...register("quantity", {
                      required: "Quantity is required",
                    })}
                    onFocus={() => setFocusedField("quantity")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "quantity"
                        ? "ring-primary-500 shadow-md"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="alertQuantity"
                  >
                    Alert Quantity
                  </label>
                  <input
                    type="number"
                    id="alertQuantity"
                    {...register("alertQuantity")}
                    onFocus={() => setFocusedField("alertQuantity")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "alertQuantity"
                        ? "ring-primary-500 shadow-md"
                        : "border-gray-300"
                    }`}
                    placeholder="Minimum stock level"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="unit"
                  >
                    Unit
                  </label>
                  <select
                    id="unit"
                    {...register("unit")}
                    onFocus={() => setFocusedField("unit")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "unit"
                        ? "ring-orange-500 shadow-md"
                        : "border-gray-300"
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
              </div>
            </div>

            {/* Tax & Additional Info */}
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="tax"
                  >
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    id="tax"
                    step="0.01"
                    {...register("tax")}
                    onFocus={() => setFocusedField("tax")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "tax"
                        ? "ring-primary-500 shadow-md"
                        : "border-gray-300"
                    }`}
                    placeholder="Tax percentage"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="taxType"
                  >
                    Tax Type
                  </label>
                  <select
                    id="taxType"
                    {...register("taxType")}
                    onFocus={() => setFocusedField("taxType")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "taxType"
                        ? "ring-primary-500 shadow-md"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select tax type</option>
                    <option value="inclusive">Inclusive</option>
                    <option value="exclusive">Exclusive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="size"
                  >
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    {...register("size")}
                    onFocus={() => setFocusedField("size")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "size"
                        ? "ring-primary-500 shadow-md"
                        : "border-gray-300"
                    }`}
                    placeholder="Product size"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="color"
                  >
                    Color
                  </label>
                  <input
                    type="text"
                    id="color"
                    {...register("color")}
                    onFocus={() => setFocusedField("color")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full input ${
                      focusedField === "color"
                        ? "ring-primary-500 shadow-md"
                        : "border-gray-300"
                    }`}
                    placeholder="Product color"
                  />
                </div>
              </div>
            </div>

            {/* Description & Photo */}
            <div className="">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={4}
                    onFocus={() => setFocusedField("description")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200 resize-none ${
                      focusedField === "description"
                        ? "ring-primary-500 shadow-md"
                        : "border-gray-300"
                    }`}
                    placeholder="Describe your product in detail..."
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    htmlFor="photo"
                  >
                    Product Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      {...register("photo")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-indigo-400 transition-colors duration-300 bg-gray-50">
                      <div className="text-4xl mb-4">📁</div>
                      <p className="text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <motion.button
                type="submit"
                disabled={loading}
                variants={buttonVariants}
                initial="idle"
                whileHover={loading ? "loading" : "hover"}
                whileTap={loading ? "loading" : "tap"}
                animate={loading ? "loading" : "idle"}
                className="w-full btn-primary"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin mr-2"></div>
                      Updating Product...
                    </div>
                  ) : (
                    <span>Update Product</span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UpdateProduct;
