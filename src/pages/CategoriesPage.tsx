import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCategory from "../components/category/AddCategory";
import axios from "axios";
import ShowCategories from "../components/category/ShowCategories";
import { Box } from "lucide-react";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination"; // ✅ Make sure this path is correct

const CategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3000/category").then((res) => {
      setCategories(res.data);
      setLoading(false);
      setCurrentPage(1); // Reset page on tab change
    });
  }, [activeTab]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="mx-auto p-4">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 focus:outline-none ${
            activeTab === "categories"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 focus:outline-none ${
            activeTab === "add"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Add Category
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === "categories" && (
            <motion.div
              key="categories"
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
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        #
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Assign Item
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5}>
                          <Loading />
                        </td>
                      </tr>
                    ) : (
                      currentCategories.length > 0 &&
                      currentCategories.map((product) => (
                        <ShowCategories
                          product={product}
                          setCategories={setCategories}
                          key={product._id}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && categories.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No category found</p>
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
              transition={{ duration: 0.4 }}
              className="relative w-[70%] mx-auto bg-white rounded-2xl ring-2 ring-blue-500 p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 ml-5">
                Add New Category
              </h2>
              <AddCategory />
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab !== "add" && (
          <div className="flex justify-end">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              pageSize={itemsPerPage}
              currentTransactions={currentCategories}
              prevPage={prevPage}
              nextPage={nextPage}
              setPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
