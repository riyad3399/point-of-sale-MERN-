import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash, View } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import axios from "axios";
import Swal from "sweetalert2";
import UpdateProduct from "./UpdateProduct";
import { Helmet } from "react-helmet-async";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { Product } from "../../types";
import { usePermission } from "../../hooks/usePermission";



interface ShowProductProps {
  product: Product;
  setAllProduct: React.Dispatch<React.SetStateAction<Product[]>>;
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, color: "#3b82f6" },
  tap: { scale: 0.9 },
};

const ShowProduct: React.FC<ShowProductProps> = ({
  product,
  setAllProduct,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {hasPermission}= usePermission()

  const navigate = useNavigate();

  const handleViewProduct = (singleProduct: Product) => {
    navigate("/showProduct", { state: { singleProduct, loading } });
  };

  const handleSingleProduct = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/product/${id}`);
      handleViewProduct(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch product details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/product/${id}`);
        setAllProduct((prev) => prev.filter((p) => p._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your product has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Show Product | POS System</title>
      </Helmet>

      <motion.tr
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hover:bg-gray-50 transition-colors"
      >
        <td className="px-4 py-3 border">
          <div className="w-12 h-12 rounded-md overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              loading="lazy"
              src={`http://localhost:3000/product/image/${product._id}`}
              alt={product.productName}
              className="object-cover w-full h-full"
            />
          </div>
        </td>
        <td className="px-4 py-3 border">{product.productCode}</td>
        <td className="px-4 py-3 border">
          {capitalizeFirstLetter(product.productName)}
          {(product.size || product.color) && (
            <div className="text-xs mt-1 flex flex-wrap gap-1">
              {product.size && (
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Size: {product.size}
                </span>
              )}
              {product.color && (
                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Color: {product.color}
                </span>
              )}
            </div>
          )}
        </td>
        <td className="px-4 py-3 border">{product.category}</td>
        <td className="px-4 py-3 border text-center">{product.quantity}</td>
        <td className="px-4 py-3 border">
          <div className="flex items-center gap-4 justify-center">
            {hasPermission("inventory", "products", ["edit"]) && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="text-gray-600 hover:text-green-500 transition-transform"
                title="Edit"
                onClick={() => setOpen(true)}
              >
                <FaRegEdit size={22} />
              </motion.button>
            )}

            {hasPermission("inventory", "products", ["view"]) && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="text-gray-600 hover:text-blue-500 transition-transform"
                title="View"
                onClick={() => handleSingleProduct(product._id)}
              >
                <View size={22} />
              </motion.button>
            )}

            {hasPermission("inventory", "products", ["delete"]) && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="text-gray-600 hover:text-red-500 transition-transform"
                title="Delete"
                onClick={() => handleDeleteProduct(product._id)}
              >
                <Trash size={22} />
              </motion.button>
            )}
          </div>
        </td>
      </motion.tr>

      {/* Modal render outside of <tr> */}
      {open && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Update Product"
        >
          <UpdateProduct product={product} />
        </Modal>
      )}
    </>
  );
};

export default ShowProduct;
