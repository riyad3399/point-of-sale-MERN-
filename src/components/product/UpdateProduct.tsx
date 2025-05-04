import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

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

const UpdateProduct: React.FC = ({ product }) => {
  const { register, handleSubmit, reset } = useForm();

 const onSubmit = async (data: any) => {
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

     const response = await fetch(`http://localhost:3000/pos/${product._id}`, {
       method: "PUT",
       body: formData,
     });

     if (response.ok) {
         Swal.fire("Success!", "Product updated successfully.", "success");
         console.log(response);
     } else {
       Swal.fire(
         "Error",
         "Something went wrong while updating the product.",
         "error"
       );
     }
   } catch (error) {
     console.error("Error submitting form:", error);
     Swal.fire("Error", "Network or server error.", "error");
   }
 };

    
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
         description: product.Description || "",
        
       });
     }
   }, [product, reset]);



  return (
    <div className="max-w-2xl max-h-xl ">
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
        {/* Product Name and Product Code */}
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
              
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex justify-between">
              Product Code / SKU
            </label>
            <input
              type="text"
              {...register("productCode")}
              readOnly
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
            />
          </div>
        </motion.div>

        {/* Category and Brand */}
        <motion.div className="grid grid-cols-2 gap-6" variants={fieldVariants}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="groceries">Groceries</option>
            </select>
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
              Purchase Price (ক্রয় মূল্য)
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
              Retail Price (খুচরা মূল্য)
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
              Wholesale Price (পাইকারি মূল্য)
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
              Quantity (পরিমাণ)
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
              placeholder="e.g. 15"
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
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
          >
            Update Product
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default UpdateProduct;
