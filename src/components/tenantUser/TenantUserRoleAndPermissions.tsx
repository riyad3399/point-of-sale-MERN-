import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { UserPermissions } from "../../types";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";
import RolePermissionForm from "../roleAndPermission/RolePermissionForm";

interface UserInfo {
  _id: string;
  userName: string;
  role: string;
  permissions: UserPermissions;
}

export default function TenantUserRoleAndPermissions() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, token, decodedUser } = useAuth();

const BASE_URL = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/user/${currentUser?.tenantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  const canAccess = ["developer"].includes(currentUser?.role || "");

  if (!canAccess) {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        ❌ Access Denied
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4">
      <Helmet>
        <title>Role & Permissions | POS System</title>
      </Helmet>

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
