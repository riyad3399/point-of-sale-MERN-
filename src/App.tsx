import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import TransactionsPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

// Context and hooks
import CategoriesPage from "./pages/CategoriesPage";
import ProductesPage from "./pages/ProductesPage";
import ShowProduct from "./pages/ShowProductPage";
import CustomersPage from "./pages/CustomersPage";
import RetailSalePage from "./pages/RetailSalePage";
import WholeSalePage from "./pages/WholeSalePage";
import InvoiceView from "./components/transaction/InvoiceView";
import ReportStatementPage from "./pages/ReportStatementPage";
import ShowReportStatement from "./components/report/ShowReportStatement";
import AlertItemsPage from "./pages/AlertItemsPage";

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="categories" element={<CategoriesPage />} />
          <Route path="productes" element={<ProductesPage />} />
          <Route path="showProduct" element={<ShowProduct />} />
          <Route path="invoiceView" element={<InvoiceView />} />
          <Route path="wholeSale" element={<WholeSalePage />} />
          <Route path="retailSale" element={<RetailSalePage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reportStatement" element={<ReportStatementPage />} />
          <Route path="showReportStatement" element={<ShowReportStatement />} />
          <Route path="alertItems" element={ <AlertItemsPage/>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
