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


