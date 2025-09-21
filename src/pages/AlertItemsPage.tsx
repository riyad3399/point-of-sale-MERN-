import axios from "axios";
import { useEffect, useState } from "react";
import AlertItemsShow from "../components/report/AlertItemsShow";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";

export default function AlertItemsPage() {
  const [products, setProducts] = useState([]);
  const { token } = useAuth()
  const BASE_URL = import.meta.env.VITE_BASE_URI;


  const fetchLowStockItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/product/low-stock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = res.data;
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchLowStockItems();
    const interval = setInterval(fetchLowStockItems, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Alert Items | POS System</title>
      </Helmet>
      <AlertItemsShow products={products} />
    </div>
  );
}
