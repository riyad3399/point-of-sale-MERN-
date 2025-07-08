import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import RoleManager from "../components/roleAndPermission/RoleManager";

interface UserInfo {
  _id: string;
  userName: string;
  roles: string[];
}

export default function UserListPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/users", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
          console.log(res.data);
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // শুধু admin / developer দেখবে
  const canAccess = currentUser?.roles?.some((role) =>
    ["admin", "developer"].includes(role)
  );

  if (!canAccess) {
    return <div className="text-center text-red-600 mt-10">Access Denied</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="space-y-6">
          {users.map((u) => (
            <div key={u._id} className="bg-white shadow rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold text-gray-700">{u.userName}</p>
                  <p className="text-sm text-gray-500">
                    Current Roles: {u.roles.join(", ")}
                  </p>
                </div>
              </div>
              <RoleManager
                user={u}
                onUpdated={(updatedUser) => {
                  setUsers((prev) =>
                    prev.map((usr) =>
                      usr._id === updatedUser.id ? updatedUser : usr
                    )
                  );
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
