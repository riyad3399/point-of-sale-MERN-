import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function UploadCsvFile() {
  const [file, setFile] = useState<File | null>(null);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload.");

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/product/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "File uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("upload failed. Please try again.");
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
