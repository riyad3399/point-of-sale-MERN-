import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import DashboardPage from "./pages/DashboardPage";
import POSPage from "./pages/POSPage";
import InventoryPage from "./pages/InventoryPage";
import TransactionsPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

// Context and hooks
import { useAppContext } from "./context/AppContext";
import CategoriesPage from "./pages/CategoriesPage";
import ProductesPage from "./pages/ProductesPage";
import ShowProduct from "./pages/ShowProductPage";
import CustomersPage from "./pages/CustomersPage";
import RetailSalePage from "./pages/RetailSalePage";

function App() {
  const { isAuthenticated } = useAppContext();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="categories" element={<CategoriesPage />} />
          <Route path="productes" element={<ProductesPage />} />
          <Route path="showProduct" element={<ShowProduct />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="retailSale" element={<RetailSalePage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
