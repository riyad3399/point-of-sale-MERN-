import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";

interface Customer {
  customerId: number;
  customerName: string;
  phone: string;
  address?: string;
}
const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, color: "#3b82f6" },
  tap: { scale: 0.9 },
};

const rowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  hover: {
    scale: 1.01,
    backgroundColor: "#f1f5f9", // Tailwind slate-100
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export default function ShowCustomerList({ customer }) {
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   setFiltered(
  //     customers.filter((c) =>
  //       c.name.toLowerCase().includes(search.toLowerCase())
  //     )
  //   );
  // }, [search, customers]);

  return (
    <motion.tr
      variants={rowVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="text-sm text-gray-800 border-b"
    >
      <td className="p-3">{customer.customerId}</td>
      <td className="p-3 font-medium">{customer.customerName}</td>
      <td className="p-3">{customer.phone}</td>
      <td className="p-3">{customer.address}</td>
      <td className="p-3 space-x-2">
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
}
