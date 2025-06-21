import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/", { replace: true }); // token থাকলে homepage/dashboard এ পাঠাও
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
};

export default PublicRoute;
