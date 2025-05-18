import axios from "axios";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import CategoryUpdateModal from "./CategoryUpdateModal";

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

const ShowCategories: React.FC<ShowCategoriesProps> = ({
  product,
  setCategories,
}) => {
  const [asignItem, setAsingItem] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeleteCategory = async (id: string) => {
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
        await axios.delete(`http://localhost:3000/category/${id}`);

        setCategories((prev) => prev.filter((cat) => cat._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your category has been deleted.",
          icon: "success",
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the category.",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/product")
      .then((res) => {
        const data = res.data;
        const filterData = data.filter(
          (d) => d.category === product.categoryName
        );
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
      <td className="px-4 py-2 border text-center">
        <div className="flex justify-center items-center gap-3">
          <div>
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="text-gray-600 hover:text-green-500"
              title="Edit"
              onClick={() => setModalOpen(true)}
            >
              <FaRegEdit size={22} />
            </motion.button>
            <CategoryUpdateModal
              open={modalOpen}
              product={product}
              setCategories={setCategories}
              onClose={() => setModalOpen(false)}
            />
          </div>
          <div>
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="text-gray-600 hover:text-red-500"
              title="Delete"
              onClick={() => handleDeleteCategory(product?._id)}
            >
              <Trash size={22} />
            </motion.button>
          </div>
        </div>
      </td>
    </motion.tr>
  );
};

export default ShowCategories;
