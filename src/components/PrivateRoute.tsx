import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    await axios
      .get("http://localhost:3000/user/profile", {
        headers: { Authorization: token },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => navigate("/login"));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return token && user ? <Outlet /> : navigate("/login");
};

export default PrivateRoute;
