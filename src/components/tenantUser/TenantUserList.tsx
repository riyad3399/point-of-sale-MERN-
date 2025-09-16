import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../Loading";
import { Key, Loader, Trash } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

interface TenantUser {
  _id: string;
  userName: string;
  role: string;
  permissions: Record<string, any>;
}

export default function UserList() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TenantUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deletingUsers, setDeletingUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.tenantId) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/user/${user.tenantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data.users);
      } catch (error) {
        toast.error("Failed to load tenant users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [users.length, token, user?.tenantId]);

  const handlePasswordChange = async () => {
    if (!newPassword || !selectedUser) return toast.error("Enter new password");
    setPasswordLoading(true);
    console.log(token);
    try {
      await axios.patch(
        `http://localhost:3000/auth/${selectedUser._id}/password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully!");
      setShowModal(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteUser = async (deleteUser: TenantUser) => {
    setDeletingUsers((prev) => [...prev, deleteUser._id]);
    try {
      const response = await axios.delete(
        `http://localhost:3000/user/${user.tenantId}/delete/${deleteUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userName: deleteUser.userName },
        }
      );

      if (response.data.success) {
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((u) => u._id !== deleteUser._id));
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Server error deleting user"
      );
      console.error("Delete User API Error:", error);
    } finally {
      setDeletingUsers((prev) => prev.filter((id) => id !== deleteUser._id));
    }
  };

  if (loading)
    return (
      <div className="text-center py-6 text-gray-500 animate-pulse">
        <Loading />
      </div>
    );

  if (users.length === 0)
    return <div className="text-center py-6 text-gray-500">No users found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-xl shadow-lg">
        <thead className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3 text-left">Username</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Permissions</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {users.map((u, index) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50 border-b cursor-pointer"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{u.userName}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2">
                  {Object.keys(u.permissions).length > 0 ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Set
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      None
                    </span>
                  )}
                </td>
                {u.role !== "developer" ? (
                  <td className="px-4 py-2">
                    {/* <div>
                      <button
                        title="Change Password"
                        onClick={() => {
                          setOpen(true);
                        }}
                        className="px-3 py-1 btn-outline text-sm"
                      >
                        <Key className="h-5 w-5 text-primary-500" />
                      </button>
                      <ChangePasswordModal
                        open={open}
                        onClose={() => setOpen(false)}
                        userName={u.userName} 
                      />
                    </div> */}
                    <button
                      title="Delete User"
                      disabled={deletingUsers.includes(u._id)}
                      onClick={() => handleDeleteUser(u)}
                      className="px-3 py-1 btn-outline text-sm "
                    >
                      {deletingUsers.includes(u._id) ? (
                        <span className="flex items-center gap-2">
                          <Loader className="animate-spin h-5 w-5" />
                        </span>
                      ) : (
                        <Trash className="h-5 w-5 text-danger-500" />
                      )}
                    </button>
                  </td>
                ) : (
                  <td className="px-5 text-gray-400 ">N/A</td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
            >
              <h3 className="text-lg font-semibold mb-4">
                Change Password for {selectedUser.userName}
              </h3>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                  className={`px-4 py-2 rounded text-white ${
                    passwordLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {passwordLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="animate-spin h-5 w-5" />
                      Updating...
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
