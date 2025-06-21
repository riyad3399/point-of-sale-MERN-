import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        await axios.get("http://localhost:3000/user/profile", {
          headers: {
            Authorization: token,
          },
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Unauthorized:", error);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default PrivateRoute;
