import axios from "axios";
import { PermissionsProps, RoleProps, Supplier, UserInfo } from "../types";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// const URI = import.meta.env.VITE_BASE_URI;
const URI = "http://localhost:3000";

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
        `${URI}/auth/logout`,
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
    const response = await axios.post(`${URI}/auth/login`, data);
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

    const res = await axios.post(`${URI}/auth/register`, data, {
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
//     .get(`${URI}/auth/me`, {
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
    const res = await axios.get(`${URI}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer টোকেন ফরম্যাট
      },
    });

    console.log("handle profile", res.data);

    // আপনার /me route success হলে message নেই, তাই যেটা দরকার সেটা নিন
    // উদাহরণস্বরূপ, ইউজার নাম বা অন্য যেকোনো তথ্য থেকে success দেখাতে পারেন
    toast.success("Profile loaded successfully");

    // প্রয়োজন মতো response থেকে ডাটা নিয়ে কাজ করতে পারেন
    // const userData = res.data.user;

    navigate("/"); // প্রয়োজনমতো রিডাইরেক্ট করুন
  } catch (err: any) {
    // err.message বা err.response.data.message থেকে error দেখাতে পারেন
    toast.error(
      err.response?.data?.message || err.message || "Failed to load profile"
    );
    navigate("/login");
  }
};

// get User profile
export const getHandleProfile = async (token: string) => {
  try {
    const res = await axios.get(`${URI}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res.data);

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
    const response = await axios.get(`${URI}/user`, {
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
    `http://localhost:3000/user/${userId}/roles`,
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
    `http://localhost:3000/user/${userId}/permissions`,
    { permissions },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  onUpdated(res.data.user);
};

// ---------------------- PRODUCT ----------------------//
// GET - ALL Products
export const handleGetProduct = async (setAllProduct, token) => {
  try {
    const res = await axios.get(`${URI}/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  id: string
) => {
  try {
    const res = await axios.put(`${URI}/purchases/${id}/pay`, {
      amount: amount,
      method: method,
      note: note,
    });
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
