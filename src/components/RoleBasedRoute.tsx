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
        const res = await axios.get("http://localhost:3000/auth/count");
        setUserCount(res.data.userCount);
        console.log(res.data.userCount);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
        setUserCount(null);
      } finally {
        setCountLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (authLoading || countLoading) return <Loading />;

  //  প্রথম user হলে সবাই register করতে পারবে
  if (userCount === 0) return <Outlet />;

  //  user না থাকলে login page এ redirect
  if (!user) return <Navigate to="/login" replace />;

  //  check if user has required role
  const hasAccess = allowedRoles.includes(user.role); //  single string check
  if (!hasAccess) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
