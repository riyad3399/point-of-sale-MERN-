import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { ArrowLeft } from "lucide-react";

const ShowProductPage: React.FC = () => {
  const location = useLocation();
  const { singleProduct } = location.state || {};

  const fields = [
    { label: "Product Code", value: singleProduct?.productCode },
    { label: "Brand", value: singleProduct?.brand },
    { label: "Product Name", value: singleProduct?.productName },
    { label: "Category", value: singleProduct?.category },
    {
      label: "Purchase Price",
      value: `$${singleProduct?.purchasePrice.toFixed(2)}`,
    },
    {
      label: "Retail Price",
      value: `$${singleProduct?.retailPrice.toFixed(2)}`,
    },
    {
      label: "Whole Sale Price",
      value: `$${singleProduct?.wholesalePrice.toFixed(2)}`,
    },
    { label: "Quantity", value: `${singleProduct?.quantity} PC` },

    { label: "Alert Quantity", value: singleProduct?.alertQuantity.toString() },
    { label: "Tax (%)", value: singleProduct?.tax },
    { label: "Tax Type", value: singleProduct?.taxType },
    { label: "Unit", value: singleProduct?.unit },
  ];

  return (
    <div>
      <h2 className="mb-4 ml-4 font-semibold">Product Details</h2>
      <Link to="/productes">
        <button className="flex mb-4 ml-4 items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 shadow-sm">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </Link>
      {singleProduct === undefined ? (
        <Loading />
      ) : (
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left - Product Info */}
          <motion.div
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerStagger}
          >
            {fields.map((field) => (
              <motion.div
                key={field._id}
                variants={itemFadeIn}
                className="space-y-1"
              >
                <div className="text-sm text-gray-500 font-medium">
                  {field.label}
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {field.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right - Image */}
          <motion.div
            className="w-full md:w-40 flex justify-center items-start"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <img
              src={`http://localhost:3000/product/image/${singleProduct?._id}`}
              alt="Product"
              className="w-32 h-32 object-cover rounded-xl border border-gray-300 shadow-sm"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Animation Variants
const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default ShowProductPage;
