import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./Loading";

const PrivateRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/profile", {
          headers: { Authorization: token },
        });
        setUser(res.data.user);
      } catch (err) {
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  if (loading)
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );

  return user ? <Outlet /> : null;
};

export default PrivateRoute;
