import axios from "axios";
import { Supplier, UserInfo } from "../types";
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
export const getHandleProfile = async (token: string, setUser) => {
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
  } catch (error) {
    setAllProduct([]);
  }
};

//-----------------------PURCHASE--------------------//

// POST
export const handleInsertPurchase = async (reset, transformed) => {
  try {
    const res = await axios.post(`${URI}/purchases/add`, transformed);
    toast.success(res.data.message || "Purchase Successfully");
    reset();
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  }
};

// PUT
export const handleUpdatePurchasePayment = async (
  amount: number,
  method: string,
  note: string,
  id:string
) => {
  try {
    const res = await axios.put(
      `${URI}/purchases/${id}/pay`,
      {
        amount: amount,
        method: method,
        note: note,
      }
    );
    toast.success(res.data.message || "payment successfull");
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  }
};

// GET
export const handleGetSinglePurchase = async (id: string, navigate) => {
  try {
    const res = await axios.get(`${URI}/purchases/${id}`);
    navigate("/purchasePayment", { state: res.data });
  } catch (error) {
    console.log(error);
  }
};

// -------------------------SUPPLIER-----------------------//

// GET - All supplier
export const handleGetSupplier = async (setSuppliers) => {
  try {
    const res = await axios.get(`${URI}/suppliers`);
    setSuppliers(res.data.data);
  } catch (error) {
    setSuppliers([]);
  }
};
