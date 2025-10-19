import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import Index from "../components/product/Index";
import axios from "axios";
import ShowProduct from "../components/product/ShowProduct";
import Loading from "../components/Loading";
import { Box, Search } from "lucide-react";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import { usePermission } from "../hooks/usePermission";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const ProductesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"productes" | "add">("productes");
  const [allProduct, setAllProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { hasPermission } = usePermission();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;
  const { t } = useTranslation();

  const canView = hasPermission("inventory", "products", ["view"]);
  const canAdd = hasPermission("inventory", "products", ["add"]);
  const defaultTab = canView ? "productes" : "add";

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/product`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProduct(res.data || []);
        setCurrentPage(1);
      } catch (err) {
        toast.error(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = allProduct.filter((product) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (product.productName || "").toLowerCase().includes(q) ||
      String(product.productCode || "").includes(q);
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const availableTabs = [
    canView && {
      key: "productes",
      label: t("product.productList") || "Products",
    },
    canAdd && { key: "add", label: t("product.addProduct") || "Add Product" },
  ].filter(Boolean) as { key: "productes" | "add"; label: string }[];

  if (!canView && !canAdd) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-600">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-full bg-white rounded-sm overflow-hidden">
      <Helmet>
        <title>{t("product.productList") || "Products"} | POS System</title>
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
              ? "bg-white text-gray-900 -mb-[1px] border border-gray-300 border-b-white rounded-t-md shadow-sm"
              : "text-gray-500 hover:text-gray-700"
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
        {activeTab === "productes" && (
          <div className="flex justify-between p-6 border-r border-l">
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
                placeholder={
                  t("product.searchPlaceholder") || "Search products"
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md input bg-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="font-medium text-sm">
                {t("product.filter") || "Filter"}:
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md input bg-white"
              >
                <option value="all">{t("product.all") || "All"}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div>
          {activeTab === "productes" && canView && (
            <motion.div
              key="productes"
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
                  <thead className="bg-gray-100 ">
                    <tr>
                      <th className="p-2 border font-light">
                        {t("product.photo") || "Photo"}
                      </th>
                      <th className="p-2 border font-light">
                        {t("product.productId") || "Product ID"}
                      </th>
                      <th className="p-2 border font-light">
                        {t("product.productName") || "Name"}
                      </th>
                      <th className="p-2 border font-light">
                        {t("product.category") || "Category"}
                      </th>
                      <th className="p-2 border font-light">
                        {t("product.quantity") || "Quantity"}
                      </th>
                      <th className="p-2 border font-light text-center">
                        {t("product.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.length > 0 ? (
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
                          <p>{t("category.no_data") || "No products found."}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {filteredProducts.length > itemsPerPage && (
                <div className="flex justify-end mt-4">
                  <Pagination
                    page={currentPage}
                    total={totalPages}
                    pageSize={itemsPerPage}
                    currentTransactions={currentProducts}
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
              className="bg-white"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <Index />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductesPage;
