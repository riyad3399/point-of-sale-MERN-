import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Loader, Upload } from "lucide-react";

export default function UploadCsvFile() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setLoading(true);

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
      setFile(null); // ✅ reset after success
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form
        className="p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-5"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          Upload Products (CSV)
        </h2>
        <p className="text-sm text-gray-500">
          Choose a CSV file to bulk import your products.
        </p>

        {/* File Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="csvFile"
            className="text-sm font-medium text-gray-700"
          >
            Select CSV File
          </label>
          <input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          {file && (
            <p className="text-xs text-green-600">✅ {file.name} selected</p>
          )}
          <p className="text-xs text-gray-500">Only .csv files are allowed</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition text-white ${
            !file || loading
              ? "bg-primary-400 cursor-not-allowed opacity-70"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              Uploading CSV...
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload CSV
            </>
          )}
        </button>
      </form>
    </div>
  );
}
