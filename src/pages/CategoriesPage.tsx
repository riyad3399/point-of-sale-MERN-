import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCategory from "../components/category/AddCategory";
import axios from "axios";
import ShowCategories from "../components/category/ShowCategories";
import { Box, Search } from "lucide-react";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";


const CategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { hasPermission } = usePermission();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const token = localStorage.getItem("token")

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCategories(res.data);
        setCurrentPage(1);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab, token]);
  

  const filteredCategories = categories.filter((cat: any) => {
    const matchSearch =
      cat.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      cat.categoryId.toString().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || cat.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const { t } = useTranslation();

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
          {t("category.title")}
        </button>
        {hasPermission("inventory", "categories", ["add"]) && (
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === "add"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {t("category.add")}
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === "categories" && (
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
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("category.search_placeholder")}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 input bg-white"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <label className="font-medium text-sm">
                    {t("category.filter")}:
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg input"
                  >
                    <option value="all">{t("category.all")}</option>
                    <option value="Pending">{t("category.pending")}</option>
                    <option value="Active">{t("category.active")}</option>
                    <option value="Inactive">{t("category.inactive")}</option>
                  </select>
                </div>
              </div>

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
                          {t("category.id")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          {t("category.name")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          {t("category.assign_item")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          {t("category.status")}
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">
                          {t("category.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="h-60">
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

                {!loading && filteredCategories.length === 0 && (
                  <div className="py-6 text-center text-gray-500">
                    <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>{t("category.no_data")}</p>
                  </div>
                )}
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
              transition={{ duration: 0.4 }}
              className="relative  bg-white rounded-2xl md:p-6"
            >
              <AddCategory />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {activeTab !== "add" && filteredCategories.length > 10 && (
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
