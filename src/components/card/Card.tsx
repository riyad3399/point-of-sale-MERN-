import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const Card: React.FC = ({ product }) => {
  console.log(product);
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl bg-white shadow-md hover:shadow-xl overflow-hidden group relative cursor-pointer transition-all"
    >
      {/* Product Image */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
        <img
          src={`http://localhost:3000/product/image/${product._id}`}
          alt={product.productName}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300 ease-in-out"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
          {product.productName}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-lg sm:text-xl">
            ${product.retailPrice.toFixed(2)}
          </span>
          <button className="p-2 rounded-full bg-primary hover:bg-primary/80 text-white transition">
            <ShoppingCart size={18} className="sm:size-5" />
          </button>
        </div>
      </div>

      {/* Background Blur on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        className="absolute inset-0 bg-primary rounded-2xl pointer-events-none"
      />
    </motion.div>
  );
};

export default Card;
