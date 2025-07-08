import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import axios from "axios";

interface RoleBasedRouteProps {
  allowedRoles?: string[];
}

export default function RoleBasedRoute({
  allowedRoles = [],
}: RoleBasedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/count"); 
        setUserCount(res.data.userCount);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
        setUserCount(null);
      } finally {
        setCountLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  // 🔄 Loading indicator
  if (authLoading || countLoading) return <Loading />;

  // 🔓 যদি এখনো কোনো user না থাকে, তাহলে register সবার জন্য open
  if (userCount === 0) return <Outlet />;

  // 🔐 ইউজার থাকলে authentication + role check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = user.roles?.some((role) => allowedRoles.includes(role));
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
