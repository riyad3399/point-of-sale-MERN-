import axios from "axios";
import { useEffect, useState } from "react";
import ShowQuotation from "../components/quotation/ShowQuotation";

export default function QuotationPage() {

    const [quotation, setQuotation]= useState([])


  const fetchAllQuotations = async () => {
    const res = await axios.get("http://localhost:3000/quotations");
    const data = res.data;
      console.log(data);
      setQuotation(data)
  };

  useEffect(() => {
    fetchAllQuotations();
  }, []);

    return <div>
      <ShowQuotation quotations={quotation}/>
  </div>;
}
