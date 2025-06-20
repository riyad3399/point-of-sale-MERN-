import axios from "axios";
import { Supplier } from "../types";

const URI = `http://localhost:3000`;

export const fetchSupplierDetails = async (
  supplierId: string
): Promise<Supplier | null> => {
  try {
    const response = await axios.get(`${URI}/suppliers/${supplierId}`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch supplier details:", error);
    return null;
  }
};

// Expense
export const updateExpense = async (id: string, data: any) => {
  try {
    const response = await axios.put(`${URI}/expenses/${id}`, data);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const deleteExpense = async (id: string) => {
  const response = await axios.delete(`${URI}/expenses/${id}`);
  return response.data;
};

// Logout
export const handleLogout = async (navigate) => {
  try {
    await axios.post(
      "http://localhost:3000/user/logout",
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    localStorage.removeItem("token");
    navigate("/login");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

// Login
export const handleLogin = async (data, navigate) => {
  await axios
    .post("http://localhost:3000/user/login", data)
    .then((user) => {
      localStorage.setItem("token", user.data.token);

      navigate("/profile");
    })
    .catch((err) => {
      navigate("/login");
    });
};

// Register
export const handleRegister = async (data, navigate) => {
  await axios
    .post("http://localhost:3000/user/register", data)
    .then((res) => {
      navigate("/login");
    })
    .catch((err) => {
      navigate("/register");
    });
};

// User profile
export const handleProfile = async (token, navigate) => {
  await axios
    .get("http://localhost:3000/user/profile", {
      headers: { Authorization: token },
    })
    .then((res) => {
      navigate("/");
      console.log(res.data);
    })
    .catch((err) => {
      navigate("/login");
    });
};

// get User
export const getHandleProfile = async (token, setUser) => {
  await axios
    .get("http://localhost:3000/user/profile", {
      headers: { Authorization: token },
    })
    .then((res) => {
      setUser(res.data.user);
    })
    .catch((err) => {});
};
