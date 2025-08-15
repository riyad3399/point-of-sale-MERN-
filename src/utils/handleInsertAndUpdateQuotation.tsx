import axios from "axios";
import Swal from "sweetalert2";
import { QuotationType } from "../types";
import { useAuth } from "../context/AuthContext";

export const handleInsertAndUpdateQuotation = async (quotation: QuotationType) => {

  const {token} =useAuth()

    try {
      const response = await axios.post(
        "http://localhost:3000/quotations/add",
        quotation,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          iconColor: "#093",
          confirmButtonColor:"#093",
          title: response.data.message || "Quotation Added Successfully!",
          timer: 2000,
          showConfirmButton: false,
          showCancelButton: true,
          timerProgressBar:true
        });
      } else if (response.status === 200) {
        Swal.fire({
          icon: "success",
          iconColor: "#3085d6",
          confirmButtonColor: "#3085d6",
          title: response.data.message || "Quotation Updated Successfully!",
          timer: 2000,
          showConfirmButton: false,
          showCancelButton: true,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Quotation Error!",
        iconColor:"#d33"
      });
    }
  };