import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Protected Pages
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductesPage from "./pages/ProductesPage";
import ShowProduct from "./pages/ShowProductPage";
import InventoryPage from "./pages/InventoryPage";
import TransactionsPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";
import CustomersPage from "./pages/CustomersPage";
import RetailSalePage from "./pages/RetailSalePage";
import WholeSalePage from "./pages/WholeSalePage";
import QuotationPage from "./pages/QuotationPage";
import ReportPage from "./pages/ReportPage";
import InvoiceView from "./components/transaction/InvoiceView";
import ShowReportStatement from "./components/report/ShowReportStatement";
import ProfitSummary from "./components/report/ProfitSummary";
import ExpensePage from "./pages/ExpensePage";
import PurchasePage from "./pages/PurchasePage";
import SupplierPage from "./pages/SupplierPage";
import AlertItemsPage from "./pages/AlertItemsPage";

// Auth Guard
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <HelmetProvider>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="productes" element={<ProductesPage />} />
              <Route path="showProduct" element={<ShowProduct />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="retailSale" element={<RetailSalePage />} />
              <Route path="wholeSale" element={<WholeSalePage />} />
              <Route path="quotation" element={<QuotationPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="invoiceView" element={<InvoiceView />} />
              <Route
                path="showReportStatement"
                element={<ShowReportStatement />}
              />
              <Route path="profitSummary" element={<ProfitSummary />} />
              <Route path="expense" element={<ExpensePage />} />
              <Route path="purchase" element={<PurchasePage />} />
              <Route path="supplier" element={<SupplierPage />} />
              <Route path="alertItems" element={<AlertItemsPage />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </HelmetProvider>
  );
}

export default App;
