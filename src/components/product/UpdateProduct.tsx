import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

interface CategoryType {
  categoryId: string;
  categoryName: string;
}

interface ProductType {
  _id: string;
  productName: string;
  productCode: string;
  category: string;
  brand: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  alertQuantity: number;
  unit: string;
  tax: number;
  taxType: string;
  size: string;
  color: string;
  description: string;
}

interface UpdateProductProps {
  product: ProductType;
}

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

const UpdateProduct: React.FC<UpdateProductProps> = ({ product }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

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
        Swal.fire(
          "Success!",
          result.message || "Product updated successfully.",
          "success"
        );
        reset(data);
      } else {
        Swal.fire(
          "Error",
          result.message || "Failed to update product.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Network or server error.", "error");
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
        size:product.size || "",
        color:product.color || "",
        description: product.description || "",
      });
    }
  }, [product, reset]);

  // const filterCategory= categories.find(cat => cat.categoryId === reset.)

  return (
    <div className="max-w-3xl p-6">
      <motion.h2
        variants={fieldVariants}
        className="text-2xl font-semibold text-gray-800 mb-6"
      >
        Update Product
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Product Name & Code */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              {...register("productName", {
                required: "Product Name is required",
              })}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Code / SKU
            </label>
            <input
              type="text"
              {...register("productCode")}
              readOnly
              className="mt-1 w-full px-4 py-2 border rounded-xl bg-gray-100 text-gray-600"
            />
          </div>
        </motion.div>

        {/* Category & Brand */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("category")}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              {...register("brand")}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Prices & Quantity */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Price
            </label>
            <input
              type="number"
              {...register("purchasePrice", {
                required: "Purchase Price is required",
              })}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            {errors.purchasePrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Retail Price
            </label>
            <input
              type="number"
              {...register("retailPrice", {
                required: "Retail Price is required",
              })}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            {errors.retailPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.retailPrice.message}
              </p>
            )}
          </div>
        </motion.div>

        {/* Wholesale Price & Quantity */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Wholesale Price
            </label>
            <input
              type="number"
              {...register("wholesalePrice", {
                required: "Wholesale Price is required",
              })}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            {errors.wholesalePrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.wholesalePrice.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              {...register("quantity", { required: "Quantity is required" })}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>
        </motion.div>

        {/* Alert & Unit */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Alert Quantity
            </label>
            <input
              type="number"
              {...register("alertQuantity")}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <select
              {...register("unit")}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="pcs">Pcs</option>
              <option value="kg">Kg</option>
              <option value="ltr">Ltr</option>
            </select>
          </div>
        </motion.div>

        {/* Tax & Tax Type */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">Tax (%)</label>
            <input
              type="number"
              {...register("tax")}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Tax Type
            </label>
            <select
              {...register("taxType")}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
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
            <label className="text-sm font-medium text-gray-700">Size</label>
            <input
              type="text"
              {...register("size")}
              placeholder="Product Size"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Color</label>
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
            rows={3}
            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Photo */}
        <motion.div variants={fieldVariants}>
          <label className="text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            {...register("photo")}
            className="block w-full mt-2 text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={fieldVariants}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold btn-primary transition duration-200"
          >
            {loading ? "Updating..." : "Update Product"}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default UpdateProduct;
