import axios from "axios";
import { Supplier, UserInfo } from "../types";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

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
    const res = await axios.post(
      `${URI}/user/logout`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    localStorage.removeItem("token");
    toast.success(res.data.message);
    navigate("/login");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

// Login
export const handleLogin = async (data: UserInfo, navigate: any) => {
  try {
    const response = await axios.post(`${URI}/user/login`, data);
    localStorage.setItem("token", response.data.token);

    toast.success(response.data.message);

    navigate("/");
  } catch (err) {
    toast.error(err.message);

    navigate("/login");
  }
};

// Register
export const handleRegister = async (data, navigate) => {
  await axios
    .post(`${URI}/user/register`, data)
    .then((res) => {
      toast.success(res.data.message);
      navigate("/login");
    })
    .catch((err) => {
      toast.error(err.message);
      navigate("/register");
    });
};

// User profile
export const handleProfile = async (token, navigate) => {
  await axios
    .get(`${URI}/user/profile`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      toast.success(res.data.message);
      navigate("/");
    })
    .catch((err) => {
      toast.error(err.message);
      navigate("/login");
    });
};

// get User
export const getHandleProfile = async (token:string, setUser) => {
  await axios
    .get(`${URI}/user/profile`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      setUser(res.data.user);
    })
    .catch((err) => {});
};

// GET - ALL Products
export const handleGetProduct = async (setAllProduct) => {
  try {
    const res = await axios.get(`${URI}/product`);
    setAllProduct(res.data);
    console.log(res.data);
  } catch (error) {
    setAllProduct([]); 
  }
};

