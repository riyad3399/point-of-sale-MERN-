import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, User, Info } from "lucide-react";

interface RolePermissionFormProps {
  user: {
    _id: string;
    userName: string;
    role: string;
    permissions: any;
  };
  onUpdated: (updatedUser: any) => void;
}

export default function RolePermissionForm({
  user,
  onUpdated,
}: RolePermissionFormProps) {
  const [role, setRole] = useState(user.role || "user");
  const [permissions, setPermissions] = useState(user.permissions || {});

  const handleToggle = (
    group: string,
    module: string,
    action: "view" | "add" | "edit" | "delete"
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [module]: {
          ...prev[group][module],
          [action]: !prev[group][module][action],
        },
      },
    }));
  };

  const handleSave = async () => {
    console.log("Sending to server:", {
      role,
      permissions,
    });

    try {
      const res = await axios.put(`http://localhost:3000/user/${user._id}`, {
        role,
        permissions,
      });
      toast.success("User updated successfully");
      onUpdated(res.data.user);
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border rounded shadow-lg p-6 mb-6"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">{user.userName}</h2>
        </div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-gray-800">Permissions</h3>

      {Object.entries(permissions).map(([groupKey, groupValue]: any) => {
        const { trigger, ...modules } = groupValue;

        return (
          <motion.div
            key={groupKey}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold capitalize text-blue-700">
                {groupKey}
              </h4>
              <Info
                className="text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                size={20}
                title="More information about this group"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(modules).map(([moduleKey, actions]: any) => (
                <motion.div
                  key={moduleKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                >
                  <p className="capitalize font-medium mb-3 text-gray-700">
                    {moduleKey}
                  </p>
                  {["view", "add", "edit", "delete"].map((action) => (
                    <label
                      key={action}
                      className="flex items-center gap-2 text-sm mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={actions[action]}
                        onChange={() =>
                          handleToggle(groupKey, moduleKey, action as any)
                        }
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{action}</span>
                    </label>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}

      <motion.button
        onClick={handleSave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
      >
        <Save size={20} />
        Save
      </motion.button>
    </motion.div>
  );
}
