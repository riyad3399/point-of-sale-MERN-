import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Loader, User } from "lucide-react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

interface PermissionActions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  trigger: boolean; 
}

interface PermissionGroup {
  trigger: boolean; 
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


export default function RolePermissionForm({
  user,
  onUpdated,
}: RolePermissionFormProps) {
  const [role, setRole] = useState(user.role ?? "user");
  const [permissions, setPermissions] = useState<Permissions>(
    user.permissions || {}
  );
  const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


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

    setLoading(true); // ✅ start loading
    try {
      const res = await axios.put(
        `http://localhost:3000/auth/${user._id}`,
        { role, permissions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": localStorage.getItem("tenantId") || "",
          },
        }
      );

      toast.success("User updated successfully");
      onUpdated(res.data.user);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update user";
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white mb-4">
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <User className="text-primary-600" size={20} />
          <span className="font-medium text-gray-800">
            {capitalizeFirstLetter(user.userName)}
          </span>
          <span className="text-sm text-gray-500">({role})</span>
        </div>
        {open ? (
          <ChevronUp className="text-gray-500" />
        ) : (
          <ChevronDown className="text-gray-500" />
        )}
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-6 pb-6"
          >
            {/* Role */}
            <div className="mb-6 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={role}
                disabled={isDeveloper}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  isDeveloper
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Permissions */}
            <h3 className="text-md font-semibold mb-4 text-gray-900">
              Permissions
            </h3>
            <div className="space-y-5">
              {Object.entries(permissions).map(([groupKey, groupValue]) => {
                const { trigger, ...modules } = groupValue;
                return (
                  <div
                    key={groupKey}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium capitalize text-primary-700">
                        {groupKey}
                      </h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={trigger}
                          disabled={isDeveloper}
                          onChange={() => handleToggleTrigger(groupKey)}
                          className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                        />
                        Enable
                      </label>
                    </div>

                    {/* Modules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(modules).map(([moduleKey, actions]) => (
                        <div
                          key={moduleKey}
                          className="bg-white border p-3 rounded shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={(actions as PermissionActions).trigger}
                              disabled={isDeveloper || !trigger}
                              onChange={() =>
                                handleToggleModuleTrigger(groupKey, moduleKey)
                              }
                              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="capitalize font-medium text-gray-800">
                              {moduleKey}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {["view", "add", "edit", "delete"].map((action) => (
                              <label
                                key={action}
                                className="flex items-center gap-2 text-sm text-gray-700"
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
                                  className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                                />
                                {action}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save button */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: !loading && !isDeveloper ? 1.05 : 1 }}
              whileTap={{ scale: !loading && !isDeveloper ? 0.95 : 1 }}
              disabled={isDeveloper || loading}
              className={`mt-6 w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-white ${
                isDeveloper || loading
                  ? "bg-primary-400 cursor-not-allowed opacity-60"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
