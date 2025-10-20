import axios from "axios";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import UpdateCustomerModal from "./UpdateCustomerModal";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { usePermission } from "../../hooks/usePermission";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Loading from "../Loading";

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

export default function ShowCustomerList({
  customer,
  setCustomers,

}: Props) {
  const [editing, setEditing] = useState(false);
  const { hasPermission } = usePermission();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;

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
      setLoading(true);
      try {
        await axios.delete(`${BASE_URL}/customer/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCustomers((prev) => prev.filter((cus) => cus._id !== id));

        toast.success("Customer deleted successfully");
      } catch (err) {
        toast.error("Failed to delete the Customer. Please try again.");
      } finally {
        setLoading(false);
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
        {capitalizeFirstLetter(customer.customerName)}
      </td>
      <td className="p-3 border border-gray-300">{customer.phone}</td>
      <td className="p-3 border border-gray-300">{customer.address}</td>
      <td className="p-3 space-x-3 border border-gray-300">
        <div className="md:flex md:justify-start grid items-center justify-center gap-2">
          {hasPermission("customers", "customers", ["edit"]) && (
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="text-gray-600 hover:text-green-500"
              title="Edit"
              onClick={() => setEditing(true)}
            >
              <FaRegEdit className="h-5 w-5" />
            </motion.button>
          )}
          {hasPermission("customers", "customers", ["delete"]) && (
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="text-gray-600 hover:text-red-500"
              title="Delete"
              onClick={() => handleDeleteCustomer(customer._id)}
            >
              <Trash className="h-5 w-5" />
            </motion.button>
          )}
        </div>
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
