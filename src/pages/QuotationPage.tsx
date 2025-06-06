import axios from "axios";
import { useEffect, useState } from "react";
import ShowQuotation from "../components/quotation/ShowQuotation";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

export default function QuotationPage() {

  const [quotation, setQuotation] = useState([])
  const [loading, setLoading]= useState<boolean>(false)


  const fetchAllQuotations = async () => {
    setLoading(true); 
    try {
      const res = await axios.get("http://localhost:3000/quotations");
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

    return (
      <div>

        <Helmet>
          <title>Quotation | POS System</title>
        </Helmet>

        {loading ? (
          <div className="flex items-center justify-center h-60">
            <Loading />
          </div>
        ) : (
          <ShowQuotation quotations={quotation} />
        )}
      </div>
    );
}
