import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import Index from "../components/product/Index";
import axios from "axios";
import ShowProduct from "../components/product/ShowProduct";
import Loading from "../components/Loading";
import { Box, Search } from "lucide-react";
import Pagination from "../components/Pagination";

const ProductesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("productes");
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/product")
      .then((res) => {
        setAllProduct(res.data);
        setLoading(false);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/category")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // 🧠 Filter logic with search + category
  const filteredProducts = allProduct.filter((product) => {
    const matchesSearch =
      product.productName?.toLowerCase().includes(search.toLowerCase()) ||
      product.productCode?.toString().includes(search);

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="mx-auto p-4">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("productes")}
          className={`px-4 py-2 focus:outline-none ${
            activeTab === "productes"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Productes
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 focus:outline-none ${
            activeTab === "add"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Add Product
        </button>
      </div>

      <div className="relative min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === "productes" && (
            <div>
              <div className="flex justify-between mb-4 mt-6 gap-4 flex-wrap">
                {/* Search Box */}
                <div className="relative w-full max-w-md">
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name or ID"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 input bg-white"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <label className="font-medium text-sm">Category:</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg input bg-white"
                  >
                    <option value="all">All</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.div
                key="productes"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="card overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 border px-4 font-medium text-gray-600">
                          Photo
                        </th>
                        <th className="text-left py-3 border px-4 font-medium text-gray-600">
                          Product ID
                        </th>
                        <th className="text-left py-3 border px-4 font-medium text-gray-600">
                          Product Name
                        </th>
                        <th className="text-left py-3 border px-4 font-medium text-gray-600">
                          Category
                        </th>
                        <th className="text-left py-3 border px-4 font-medium text-gray-600">
                          Quantity
                        </th>
                        <th className="py-3 border px-4 font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6">
                            <Loading />
                          </td>
                        </tr>
                      ) : currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                          <ShowProduct
                            product={product}
                            key={product._id}
                            setAllProduct={setAllProduct}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-6 text-gray-500"
                          >
                            <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No products found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "add" && (
            <motion.div
              key="add"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full mx-auto"
            >
              <Index />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          {!loading &&
            activeTab === "productes" &&
            filteredProducts.length > 0 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                pageSize={itemsPerPage}
                currentTransactions={currentProducts}
                prevPage={prevPage}
                nextPage={nextPage}
                setPage={setCurrentPage}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductesPage;
