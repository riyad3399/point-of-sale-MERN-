import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, User } from "lucide-react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

interface PermissionActions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  trigger: boolean; // সাবমডিউল লেভেলের trigger
}

interface PermissionGroup {
  trigger: boolean; // parent গ্রুপ লেভেলের trigger
  [subModule: string]: PermissionActions | boolean;
}

interface Permissions {
  [group: string]: PermissionGroup;
}

interface RolePermissionFormProps {
  user: {
    _id: string;
    userName: string;
    role: string;
    permissions: Permissions;
  };
  onUpdated: (updatedUser: any) => void;
}

const AVAILABLE_ROLES = ["user", "manager", "admin", "developer"];

export default function RolePermissionForm({
  user,
  onUpdated,
}: RolePermissionFormProps) {
  const [role, setRole] = useState(user.role ?? "user");
  const [permissions, setPermissions] = useState<Permissions>(
    user.permissions || {}
  );
  const isDeveloper = role === "developer";

  // CRUD action toggle
  const handleToggle = (
    group: string,
    module: string,
    action: keyof PermissionActions
  ) => {
    if (isDeveloper) return;

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

  // Parent group trigger toggle
  const handleToggleTrigger = (group: string) => {
    if (isDeveloper) return;

    setPermissions((prev) => {
      const newTrigger = !prev[group]?.trigger;

      // যদি parent trigger off হয়, তবে সব সাবমডিউল trigger ও actions false হবে
      const updatedModules = Object.entries(prev[group])
        .filter(([key]) => key !== "trigger")
        .reduce((acc, [moduleKey, actions]) => {
          acc[moduleKey] = {
            ...actions,
            trigger: newTrigger
              ? (actions as PermissionActions).trigger
              : false,
            view: newTrigger ? (actions as PermissionActions).view : false,
            add: newTrigger ? (actions as PermissionActions).add : false,
            edit: newTrigger ? (actions as PermissionActions).edit : false,
            delete: newTrigger ? (actions as PermissionActions).delete : false,
          };
          return acc;
        }, {} as { [module: string]: PermissionActions });

      return {
        ...prev,
        [group]: {
          trigger: newTrigger,
          ...updatedModules,
        },
      };
    });
  };

  // Submodule trigger toggle
  const handleToggleModuleTrigger = (group: string, module: string) => {
    if (isDeveloper) return;

    setPermissions((prev) => {
      const currentModule = prev[group][module] as PermissionActions;
      const newTrigger = !currentModule.trigger;

      return {
        ...prev,
        [group]: {
          ...prev[group],
          [module]: {
            ...currentModule,
            trigger: newTrigger,
            view: newTrigger ? currentModule.view : false,
            add: newTrigger ? currentModule.add : false,
            edit: newTrigger ? currentModule.edit : false,
            delete: newTrigger ? currentModule.delete : false,
          },
        },
      };
    });
  };

  // Save handler
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/auth/${user._id}`,
        { role, permissions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": localStorage.getItem("tenantId") || "", // ✅ attach tenant ID
          },
        }
      );

      toast.success("User updated successfully");
      onUpdated(res.data.user);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update user";
      toast.error(message);
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
          <h2 className="text-xl font-bold text-gray-800">
            {capitalizeFirstLetter(user.userName)}
          </h2>
        </div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Role
        </label>

        <input
          type="text"
          value={role}
          disabled={isDeveloper}
          onChange={(e) => setRole(e.target.value)}
          className={`w-full border rounded-md px-3 py-2 ${
            isDeveloper
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }`}
        />
      </div>

      <h3 className="text-lg font-semibold mb-4 text-gray-800">Permissions</h3>

      {Object.entries(permissions).map(([groupKey, groupValue]) => {
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
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trigger}
                  disabled={isDeveloper}
                  onChange={() => handleToggleTrigger(groupKey)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                Enable
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(modules).map(([moduleKey, actions]) => (
                <motion.div
                  key={moduleKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2 bg-gradient-to-r from-success-200  to-primary-200  rounded ">
                    <label className="flex pr-1 pt-1 pb-1 items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(actions as PermissionActions).trigger}
                        disabled={isDeveloper || !trigger}
                        onChange={() =>
                          handleToggleModuleTrigger(groupKey, moduleKey)
                        }
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    <p className="capitalize font-medium text-gray-700">
                      {moduleKey}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 ">
                    {["view", "add", "edit", "delete"].map((action) => (
                      <label
                        key={action}
                        className="flex items-center gap-2 text-sm mb-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            (actions as PermissionActions)[
                              action as keyof PermissionActions
                            ]
                          }
                          disabled={
                            !trigger ||
                            !(actions as PermissionActions).trigger ||
                            isDeveloper
                          }
                          onChange={() =>
                            handleToggle(
                              groupKey,
                              moduleKey,
                              action as keyof PermissionActions
                            )
                          }
                          className={`form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 ${
                            !trigger || !(actions as PermissionActions).trigger
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        />
                        <span className="text-gray-700">{action}</span>
                      </label>
                    ))}
                  </div>
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
        disabled={isDeveloper}
        className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
          isDeveloper ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <Save size={20} />
        Save
      </motion.button>
    </motion.div>
  );
}
