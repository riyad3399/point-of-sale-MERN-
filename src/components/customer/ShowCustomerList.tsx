import axios from "axios";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import UpdateCustomerModal from "./UpdateCustomerModal";

interface Customer {
  _id: string;
  customerId: number;
  customerName: string;
  phone: string;
  address?: string;
}

interface Props {
  customer: Customer;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, color: "#3b82f6" },
  tap: { scale: 0.9 },
};

const rowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function ShowCustomerList({ customer, setCustomers }: Props) {
  const [editing, setEditing] = useState(false);

  const handleDeleteCustomer = async (id: string) => {
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
        await axios.delete(`http://localhost:3000/customer/${id}`);

        setCustomers((prev) => prev.filter((cus) => cus._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your category has been deleted.",
          icon: "success",
        });
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the category.",
          icon: "error",
        });
      }
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hover:bg-gray-100 transition-colors "
    >
      <td className="p-3 border border-gray-300">{customer.customerId}</td>
      <td className="p-3 border border-gray-300 font-medium">
        {customer.customerName}
      </td>
      <td className="p-3 border border-gray-300">{customer.phone}</td>
      <td className="p-3 border border-gray-300">{customer.address}</td>
      <td className="p-3 space-x-3 border border-gray-300">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="text-gray-600 hover:text-green-500"
          title="Edit"
          onClick={() => setEditing(true)}
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
          onClick={() => handleDeleteCustomer(customer._id)}
        >
          <Trash size={22} />
        </motion.button>
        <div>
          {editing && (
            <UpdateCustomerModal
              customer={customer}
              setCustomers={setCustomers}
              onClose={() => setEditing(false)}
            />
          )}
        </div>
      </td>
    </motion.tr>
  );
}
