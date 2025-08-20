import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../Loading";

interface TenantUser {
  _id: string;
  userName: string;
  role: string;
  permissions: Record<string, any>;
}

export default function UserList() {
  const { token, decodedUser } = useAuth();
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!decodedUser?.tenantId) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/user/${decodedUser.tenantId}`,
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
  }, [decodedUser, token]);

  if (loading)
    return (
      <div className="text-center py-6 text-gray-500 animate-pulse">
        <Loading/>
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
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
