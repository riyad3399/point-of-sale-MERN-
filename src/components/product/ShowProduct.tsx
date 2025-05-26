import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash, View } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import axios from "axios";
import Swal from "sweetalert2";
import UpdateProduct from "./UpdateProduct";

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, color: "#3b82f6" },
  tap: { scale: 0.9 },
};

const ShowProduct: React.FC = ({ product, setAllProduct }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleViewProduct = (singleProduct) => {
    navigate("/showProduct", { state: { singleProduct, loading } });
  };

  const handleSingleProduct = async (id: string) => {
    setLoading(true);
    await axios
      .get(`http://localhost:3000/product/${id}`)
      .then((res) => {
        handleViewProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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

        // Update UI after successful delete
        setAllProduct((prev) => prev.filter((product) => product._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your product has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete the product.",
        });
      }
    }
  };

  return (
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
      <td className="px-4 py-3 border flex flex-col">
        {product.productName}{" "}
        <span className="flex justify-between mt-1.5 text-sm">
          <span>Size: {product.size}</span>
          <span className="flex items-center">
            <span>Color: </span>
            {product.color && (
              <span
                title={product.color}
                style={{
                  height: 12,
                  width: 12,
                  backgroundColor: product.color,
                }}
              ></span>
            )}
          </span>
        </span>
      </td>
      <td className="px-4 py-3 border">{product.category}</td>
      <td className="px-4 py-3 border text-center">{product.quantity}</td>
      <td className="px-4 py-3 border">
        <div className="flex items-center gap-4 justify-center">
          <div className="z-40">
            <Modal isOpen={open} onClose={() => setOpen(false)} title="">
              <UpdateProduct product={product} />
            </Modal>
          </div>
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="text-gray-600 hover:text-green-500"
            title="Edit"
            onClick={() => setOpen(true)}
          >
            <FaRegEdit size={22} />
          </motion.button>
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="text-gray-600 hover:text-blue-500"
            title="View"
          >
            <View size={22} onClick={() => handleSingleProduct(product._id)} />
          </motion.button>

          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="text-gray-600 hover:text-red-500"
            title="Delete"
            onClick={() => handleDeleteProduct(product._id)}
          >
            <Trash size={22} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default ShowProduct;
