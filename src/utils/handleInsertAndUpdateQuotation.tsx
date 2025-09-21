import axios from "axios";
import { QuotationType } from "../types";
import toast from "react-hot-toast";

export const handleInsertAndUpdateQuotation = async (
  quotation: QuotationType
) => {
  const { token } = { token: localStorage.getItem("token") || "" };
  const BASE_URL = import.meta.env.VITE_BASE_URI;

  try {
    const response = await axios.post(
      `${BASE_URL}/quotations/add`,
      quotation,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 201) {
      toast.success(response.data.message || "Quotation Added Successfully!");
    } else if (response.status === 200) {
      toast.success(response.data.message || "Quotation Updated Successfully!");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Quotation Error!");
  }
};
