import axios from "axios";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";

interface Category {
  categoryId: number;
  categoryName: string;
  status: string;
}

interface ShowCategoriesProps {
  product: Category;
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, color: "#3b82f6" },
  tap: { scale: 0.9 },
};

const ShowCategories: React.FC<ShowCategoriesProps> = ({ product }) => {
  const [asignItem, setAsingItem] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/pos")
      .then((res) => {
        const data = res.data;
        const filterData = data.filter(
          (d) => d.category === product.categoryName
        );
        console.log(filterData);
        setAsingItem(filterData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hover:bg-gray-100 transition-colors"
    >
      <td className="px-4 py-2 border text-left">{product?.categoryId}</td>
      <td className="px-4 py-2 border text-left">{product?.categoryName}</td>
      <td className="px-4 py-2 border text-left">{asignItem.length}</td>
      <td className="px-4 py-2 border text-left">{product?.status}</td>
      <td className="px-4 py-2 border text-center space-x-3">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="text-gray-600 hover:text-green-500"
          title="Edit"
        >
          <FaRegEdit size={22} />
        </motion.button>
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="text-gray-600 hover:text-red-500"
          title="Delete"
        >
          <Trash size={22} />
        </motion.button>
      </td>
    </motion.tr>
  );
};

export default ShowCategories;
