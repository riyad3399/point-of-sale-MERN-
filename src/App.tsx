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
import ShowReportStatement from "./components/report/ShowReportStatement";
import AlertItemsPage from "./pages/AlertItemsPage";
import { HelmetProvider } from "react-helmet-async";
import QuotationPage from "./pages/QuotationPage";
import ReportPage from "./pages/ReportPage";
import ProfitSummary from "./components/report/ProfitSummary";
import ExpensePage from "./pages/ExpensePage";
import PurchasePage from "./pages/PurchasePage";
import SupplierPage from "./pages/SupplierPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <HelmetProvider>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="productes" element={<ProductesPage />} />
              <Route path="showProduct" element={<ShowProduct />} />
              <Route path="invoiceView" element={<InvoiceView />} />
              <Route path="wholeSale" element={<WholeSalePage />} />
              <Route path="retailSale" element={<RetailSalePage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="quotation" element={<QuotationPage />} />
              <Route path="profitSummary" element={<ProfitSummary />} />
              <Route path="expense" element={<ExpensePage />} />
              <Route path="purchase" element={<PurchasePage />} />
              <Route path="supplier" element={<SupplierPage />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="showReportStatement"
                element={<ShowReportStatement />}
              />
              <Route path="alertItems" element={<AlertItemsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </HelmetProvider>
  );
}

export default App;
