import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useRegisterVisibility = () => {
  const { user, token } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URI;





  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const count = res.data.userCount;

        if (count === 0) {
          setVisible(true); 
        } else if (
          user &&
          ["developer", "admin"].some((role) => user.roles?.includes(role))
        ) {
          setVisible(true); 
        } else {
          setVisible(false); 
        }
      } catch (err) {
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserCount();
  }, [user]);

  return { visible, loading };
};
