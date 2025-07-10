import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import RolePermissionForm from "../components/roleAndPermission/RolePermissionForm";
import { UserPermissions } from "../types";
import { useAuth } from "../context/AuthContext";

interface UserInfo {
  _id: string;
  userName: string;
  role: string; 
  permissions: UserPermissions;
}

export default function UserManagenentsPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        setUsers(res.data.users);
      } catch (err) {
        toast.error("Failed to load users");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const canAccess = ["admin", "developer"].includes(currentUser?.role || "");

  if (!canAccess) {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        ❌ Access Denied
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Helmet>
        <title>User Management | POS System</title>
      </Helmet>
      <h2 className="text-2xl mb-6 font-bold text-center">
        User Role & Permission
      </h2>

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          {users.map((u) => (
            <RolePermissionForm
              key={u._id}
              user={u}
              onUpdated={(updatedUser) =>
                setUsers((prev) =>
                  prev.map((usr) =>
                    usr._id === updatedUser._id ? updatedUser : usr
                  )
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
