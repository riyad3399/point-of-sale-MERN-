import { useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { warningToast } from "../helper/warningToast";


interface UserInfo {
  _id: string;
  userName: string;
  roles: string[];
}

interface RoleManagerProps {
  user: UserInfo; // Target user যাকে update করতে চাও
  onUpdated?: (updatedUser: UserInfo) => void;
}

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
  { label: "Developer", value: "developer" },
];

export default function RoleManager({ user, onUpdated }: RoleManagerProps) {
  const [selectedRoles, setSelectedRoles] = useState(
    user.roles
      .map((r) => roleOptions.find((opt) => opt.value === r))
      .filter(Boolean) as any[]
  );
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const handleSave = async () => {
    if (!currentUser) return;
    if (currentUser.id === user._id) {
      return warningToast("You cannot change your own roles!");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/user/${user._id}/roles`,
        {
          roles: selectedRoles.map((r) => r.value),
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Roles updated!");
      onUpdated?.(response.data.user);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update roles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-4 rounded-xl shadow-md"
    >
      <h3 className="font-semibold text-lg mb-2 text-gray-700">
        Manage Roles for <span className="text-sky-600">{user.userName}</span>
      </h3>

      <Select
        isMulti
        value={selectedRoles}
        options={roleOptions}
        onChange={(values) => setSelectedRoles(values)}
        className="mb-4"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-all"
      >
        {loading ? "Updating..." : "Update Roles"}
      </button>
    </motion.div>
  );
}
