import axios from "axios";
import { useEffect, useState } from "react";
import ShowQuotation from "../components/quotation/ShowQuotation";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import { QuotationType } from "../types";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function QuotationPage() {
  const [quotation, setQuotation] = useState<QuotationType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URI;


  const fetchAllQuotations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/quotations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setQuotation(data);
    } catch (err) {
      console.error("Failed to fetch quotations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuotations();
  }, []);

  const handleEditQuotation = (id: string) => {
    const selected = quotation.find((q) => q._id === id);
    if (!selected) return;

    if (selected.saleType === "retailSale") {
      navigate("/retailSale", { state: selected });
    } else if (selected.saleType === "wholeSale") {
      navigate("/wholeSale", { state: selected });
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",

      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(`${BASE_URL}/quotations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Quotation deleted successfully!");

      setQuotation((prev) => prev.filter((q) => q._id !== id));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete quotation."
      );
    }
  };

  return (
    <div>
      <Helmet>
        <title>Quotation | POS System</title>
      </Helmet>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <ShowQuotation
          quotations={quotation}
          onEdit={handleEditQuotation}
          onDelete={handleDeleteQuotation}
        />
      )}
    </div>
  );
}
