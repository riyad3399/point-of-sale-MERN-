import axios from "axios";
import { useState } from "react";

export default function UploadCsvFile() {
    const [file, setFile] = useState<File | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("ফাইল দিন");

    const formData = new FormData();
    formData.append("csv", file); 

    try {
      const res = await axios.post(
        "http://localhost:3000/product/upload-csv",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert("আপলোডে সমস্যা হয়েছে");
    }
  };

  return (
    <div>
      <form className="p-4 rounded" onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="ml-2 btn-primary text-white px-3 py-1 rounded"
        >
        Upload
        </button>
      </form>
    </div>
  );
}
