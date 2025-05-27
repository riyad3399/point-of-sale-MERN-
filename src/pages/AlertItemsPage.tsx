import axios from "axios";
import { useEffect, useState } from "react";
import AlertItemsShow from "../components/report/AlertItemsShow";

export default function AlertItemsPage() {
  const [products, setProducts] = useState([]);

  const fetchLowStockItems = async () => {
    try {
      const res = await axios.get("http://localhost:3000/product/low-stock");
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
      <AlertItemsShow products={products} />
    </div>
  );
}
