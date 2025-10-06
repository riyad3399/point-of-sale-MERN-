import axios from "axios";
import { PermissionsProps, RoleProps, Supplier } from "../types";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URI;

export const fetchSupplierDetails = async (
  supplierId: string
): Promise<Supplier | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/suppliers/${supplierId}`);
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
    const response = await axios.put(`${BASE_URL}/expenses/${id}`, data);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const deleteExpense = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/expenses/${id}`);
  return response.data;
};

// ----------------------Category----------------------//
// GET - All Categories
export const handleGetCategory = async ({
  setCategories,
  setLoading,
  setCurrentPage, // optional
}) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BASE_URL}/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCategories(res.data);

    if (typeof setCurrentPage === "function") {
      setCurrentPage(1);
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
  } finally {
    setLoading(false);
  }
};



// ---------------------- USER ----------------------//

// Logout
export const useHandleLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        logout();
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data?.message || "Logout successful");
    } catch (err) {
      toast.error("Logout failed");
    } finally {
      logout(); // context logout call
      navigate("/login");
    }
  };

  return handleLogout;
};

// Login handleLogin
export const handleLogin = async (
  data: { userName: string; password: string; tenantId?: string },
  navigate: (path: string) => void,
  login: (token: string, refreshToken: string, user: any) => void
) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    const { token, refreshToken, user, message } = response.data;
    console.log(response);

    // 1️⃣ Context update
    login(token, refreshToken, user);

    toast.success(message || "Login successful!");
    navigate("/");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Login failed");
    navigate("/login");
  }
};

// Register
export const handleRegister = async (data, navigate) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(`${BASE_URL}/auth/register`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const successMsg = res.data.message || "Registration successful!";
    toast.success(successMsg);
    navigate("/login");
  } catch (err) {
    const msg = err.response?.data?.message || "Registration failed";
    toast.error(msg);
    navigate("/register");
  }
};

// User profile
// export const handleProfile = async (token: string, navigate) => {
//   await axios
//     .get(`${BASE_URL}/auth/me`, {
//       headers: { Authorization: token },
//     })
//     .then((res) => {
//       toast.success(res.data.message);
//       navigate("/");
//     })
//     .catch((err) => {
//       toast.error(err.message);
//       navigate("/login");
//     });
// };
export const handleProfile = async (token: string, navigate: any) => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("handle profile", res.data);

    toast.success(res.data.message || "Profile loaded");

    navigate("/");
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || err.message || "Failed to load profile"
    );
    navigate("/login");
  }
};

// get User profile
export const getHandleProfile = async (token: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    console.error(
      "Profile fetch failed:",
      err?.response?.data?.message || err.message
    );
    return null;
  }
};

// GET - all users
export const getAllUsers = async (token: string | null) => {
  try {
    const response = await axios.get(`${BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.users;
  } catch (error) {
    console.error(
      "Failed to fetch users:",
      error?.response?.data?.message || error.message
    );
    throw new Error("Could not fetch users");
  }
};

// update user role
export const handleUpdateUserRoles = async ({
  roles,
  userId,
  token,
}: RoleProps) => {
  await axios.post(
    `${BASE_URL}/user/${userId}/roles`,
    { roles },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// update user permission
export const handleUpdateUserPermission = async ({
  permissions,
  token,
  onUpdated,
  userId,
}: PermissionsProps) => {
  const res = await axios.post(
    `${BASE_URL}/user/${userId}/permissions`,
    { permissions },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  onUpdated(res.data.user);
};

// change password
export const changePassword = async (userName: string, newPassword: string) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/auth/change-password/${userName}`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Server error");
    return false;
  }
};

// ---------------------- PRODUCT ----------------------//
// GET - ALL Products
export const handleGetProduct = async (
  setAllProduct: (products: any[]) => void,
  token: string | null,
  setLoading?: (loading: boolean) => void
) => {
  try {
    if (setLoading) setLoading(true);

    const res = await axios.get(`${BASE_URL}/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAllProduct(res.data || []);
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    setAllProduct([]);
    toast.error(error.response?.data?.message || "Failed to load products!");
  } finally {
    if (setLoading) setLoading(false);
  }
};

//-----------------------PURCHASE--------------------//

// POST
export const handleInsertPurchase = async (reset, transformed) => {
  try {
    const res = await axios.post(`${BASE_URL}/purchases/add`, transformed, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
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
  id: string
) => {
  try {
    const res = await axios.put(`${BASE_URL}/purchases/${id}/pay`, {
      amount: amount,
      method: method,
      note: note,
    });
    toast.success(res.data.message || "payment successfull");
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  }
};

// GET - single purchase
export const handleGetSinglePurchase = async (id: string, navigate) => {
  try {
    const res = await axios.get(`${BASE_URL}/purchases/${id}`);
    navigate("/purchasePayment", { state: res.data });
  } catch (error) {
    console.log(error);
  }
};

// GET - all purchases
export const getAllPurchases = async (setPurchases) => {
  try {
    const res = await axios.get(`${BASE_URL}/purchases`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = res.data.data;
    setPurchases(data)
  } catch (error) {
    console.log(error);
  }
};

// -------------------------SUPPLIER-----------------------//

// GET - All supplier
export const handleGetSupplier = async (setSuppliers) => {
  try {
    const res = await axios.get(`${BASE_URL}/suppliers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setSuppliers(res.data.data);
  } catch (error) {
    setSuppliers([]);
  }
};

// --------------------------INVOICE-----------------------//

// GET - Total Sales
export const fetchTotalSales = async (setTotalSales, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/invoice/total-sales`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = res.data;
    setTotalSales(data);
  } catch (error) {
    console.log(error);
    toast.error(error.message || "something went wrong");
  } finally {
    setLoading(false);
  }
};

// GET - Today Sales
export const fetchTodaySales = async (setTodaySales, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/invoice/today-sales`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = res.data;
    setTodaySales(data);
  } catch (error) {
    console.log(error);
    toast.error(error.message || "something went wrong");
  } finally {
    setLoading(false);
  }
};

// GET - Sales in last 7 days
export const fetchOverviewData = async (setChartData, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/invoice/sales-7-days`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setChartData(res.data);
  } catch (error) {
    console.log(error);
    toast.error(error.message || "something went wrong");
  } finally {
    setLoading(false);
  }
};

// GET - Recent Transactions
export const fetchRecentTransactions = async (
  setRecentTransactions,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/invoice/recent-transactions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = res.data;
    setRecentTransactions(data);
  } catch (error) {
    console.log(error);
    toast.error(error.message || "something went wrong");
  } finally {
    setLoading(false);
  }
};

// GET- Default Due Customers
export const fetchDefaultDueCustomers = async (setLoading, setDueCustomers) => {
  setLoading(true);
  try {
    const response = await axios.get(`${BASE_URL}/invoice/due-customers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setDueCustomers(response.data);
  } catch (error) {
    console.error(error);
    toast.error(error.message || "something went wrong");
  } finally {
    setLoading(false);
  }
};
