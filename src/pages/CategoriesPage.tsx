import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddCategory from "../components/category/AddCategory";
import ShowCategories from "../components/category/ShowCategories";
import { Box, Search } from "lucide-react";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";
import { handleGetCategory } from "../utils/api";
import { Helmet } from "react-helmet-async";

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const CategoriesPage: React.FC = () => {
  const { hasPermission } = usePermission();
  const { t } = useTranslation();

  const canView = hasPermission("inventory", "categories", ["view"]);
  const canAdd = hasPermission("inventory", "categories", ["add"]);

  const defaultTab = canView ? "categories" : "add";
  const [activeTab, setActiveTab] = useState<"categories" | "add">(defaultTab);

  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    handleGetCategory({ setCategories, setCurrentPage, setLoading });
  }, [activeTab]);

  const searchLower = search.toLowerCase();

  const filteredCategories = categories.filter((cat: any) => {
    const name = String(cat.categoryName || "").toLowerCase();
    const id = String(cat.categoryId ?? "").toLowerCase();
    const matchSearch = name.includes(searchLower) || id.includes(searchLower);
    const matchStatus = statusFilter === "all" || cat.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const availableTabs = [
    canView && {
      key: "categories",
      label: t("category.title") || "Categories",
    },
    canAdd && { key: "add", label: t("category.add") || "Add Category" },
  ].filter(Boolean) as { key: "categories" | "add"; label: string }[];

  return (
    <div className="w-full mx-auto bg-gray-50 rounded-sm overflow-hidden">
      <Helmet>
        <title>Categories | POS System</title>
      </Helmet>

      {availableTabs.length > 0 && (
        <div
          role="tablist"
          aria-label="Products tabs"
          className="relative flex justify-start border-b border-gray-300 bg-gray-50"
        >
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                title={tab.label}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`relative px-5 py-2 text-sm font-medium transition-all duration-200
          ${
            isActive
              ? "bg-white text-primary-700 -mb-[1px] border border-gray-300 border-b-white rounded-t-md shadow-sm"
              : "text-gray-500 hover:text-primary-500"
          }
        `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div className=" bg-gray-50 min-h-full ">
        {activeTab === "categories" ? (
          <div className="flex justify-between items-center p-6 border-r border-l">
            <div className="relative w-full max-w-md mb-4 ">
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
                placeholder={
                  t("category.search_placeholder") || "Search categories"
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg input bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="mr-2 text-sm font-medium">
                {t("category.filter") || "Filter"}:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg"
              >
                <option value="all">{t("category.all") || "All"}</option>
                <option value="Pending">
                  {t("category.pending") || "Pending"}
                </option>
                <option value="Active">
                  {t("category.active") || "Active"}
                </option>
                <option value="Inactive">
                  {t("category.inactive") || "Inactive"}
                </option>
              </select>
            </div>
          </div>
        ) : (
          ""
        )}
        <div>
          {activeTab === "categories" && canView && (
            <motion.div
              key="categories"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className=" md:overflow-hidden overflow-x-auto"
            >
              {loading ? (
                <Loading />
              ) : (
                <table className="w-full border border-gray-300 text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">{t("category.id") || "ID"}</th>
                      <th className="p-2 border">
                        {t("category.name") || "Name"}
                      </th>
                      <th className="p-2 border">
                        {t("category.assign_item") || "Assigned Items"}
                      </th>
                      <th className="p-2 border">
                        {t("category.status") || "Status"}
                      </th>
                      <th className="p-2 border text-center">
                        {t("category.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>

                  <tbody >
                    {currentCategories.map((cat, idx) => (
                      <ShowCategories
                        key={cat._id ?? idx}
                        product={cat}
                        setCategories={setCategories}
                      />
                    ))}
                  </tbody>
                </table>
              )}

              {/* No data message */}
              {filteredCategories.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>{t("category.no_data") || "No categories found."}</p>
                </div>
              )}

              {/* Pagination */}
              {filteredCategories.length > itemsPerPage && (
                <div className="flex justify-end mt-4">
                  <Pagination
                    page={currentPage}
                    totalPages={Math.ceil(
                      filteredCategories.length / itemsPerPage
                    )}
                    pageSize={itemsPerPage}
                    currentTransactions={currentCategories}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    setPage={setCurrentPage}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "add" && canAdd && (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <AddCategory />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
