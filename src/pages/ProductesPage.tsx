import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import Index from "../components/product/Index";
import axios from "axios";
import ShowProduct from "../components/product/ShowProduct";
import Loading from "../components/Loading";
import { Box } from "lucide-react";
import Pagination from "../components/Pagination"; // Make sure path is correct

const ProductesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("productes");
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        setCurrentPage(1); // Reset page when tab or data changes
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [activeTab]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = allProduct.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allProduct.length / itemsPerPage);

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
            <motion.div
              key="productes"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="card overflow-hidden"
            >
              <div>
                <input type="search" name="" id="" />
               
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Photo
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Product ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Product Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-600">
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
                    ) : (
                      currentProducts.map((product) => (
                        <ShowProduct
                          product={product}
                          key={product._id}
                          setAllProduct={setAllProduct}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && allProduct.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No products found</p>
                </div>
              )}
            </motion.div>
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
        <div className="flex justify-end">
          {!loading && activeTab === "productes" && (
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
