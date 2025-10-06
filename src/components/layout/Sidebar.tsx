import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  FileText,
  Settings,
  Users,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Coins,
  Truck,
  Tags,
  Boxes,
  PackageSearch,
  BarChart3,
  PackagePlus,
  FileSignature,
  Wrench,
  Undo2,
  Undo,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { usePermission } from "../../hooks/usePermission";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { hasPermission, hasModuleAccess } = usePermission();

  const { t } = useTranslation();
  const { user } = useAuth();
  

  useEffect(() => {
    setCollapsed(pathName === "/retailSale" || pathName === "/wholeSale");
    setReportOpen(pathName.startsWith("/report"));
  }, [pathName]);

  const isDeveloper = user?.role === "developer";

  const toggleMenu = (menuKey: string) => {
    if (collapsed) setCollapsed(false);
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <aside
      className={`hidden md:flex ${collapsed ? "w-20" : "w-64"} 
      bg-primary-600 text-white flex-col h-screen sticky top-0 transition-all duration-300 overflow-y-auto custom-scroll`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-6">
        {!collapsed && (
          <motion.div
            className="text-xl font-bold flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/">
              <img src={"/photo/logo.png"} alt="Logo" className=" w-[85%]" />
            </Link>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white transition rounded-md bg-primary-700"
        >
          {collapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-1.5 px-2">
        <div className="space-y-1">
          <SidebarLink
            to="/"
            icon={<BarChart3 />}
            text={t("sidebar.dashboard")}
            collapsed={collapsed}
            title={t("sidebar.dashboard")}
          />
          {hasModuleAccess("sales") && (
            <div
              onClick={() => toggleMenu("sales")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/retailSale") ||
                pathName.startsWith("/wholeSale") ||
                pathName.startsWith("/transactions") ||
                pathName.startsWith("/quotation")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <ShoppingCart />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Sales
                </span>
              )}
              {!collapsed && (
                <motion.div animate={{ rotate: openMenus["sales"] ? 90 : 0 }}>
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["sales"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("sales", "retailSale", ["trigger"]) && (
                <SidebarLink
                  to="/retailSale"
                  icon={<ShoppingCart size={18} />}
                  text={t("sidebar.retailSale")}
                  collapsed={collapsed}
                  title={t("sidebar.retailSale")}
                />
              )}
              {hasPermission("sales", "wholeSale", ["trigger"]) && (
                <SidebarLink
                  to="/wholeSale"
                  icon={<PackageSearch size={18} />}
                  text={t("sidebar.wholeSale")}
                  collapsed={collapsed}
                  title={t("sidebar.wholeSale")}
                />
              )}
              {hasPermission("sales", "transactions", ["trigger"]) && (
                <SidebarLink
                  to="/transactions"
                  icon={<FileText size={18} />}
                  text={t("sidebar.transactions")}
                  collapsed={collapsed}
                  title={t("sidebar.transactions")}
                />
              )}

              {hasPermission("sales", "quotations", ["trigger"]) && (
                <SidebarLink
                  to="/quotation"
                  icon={<FileSignature size={18} />}
                  text={t("sidebar.quotations")}
                  collapsed={collapsed}
                  title={t("sidebar.quotations")}
                />
              )}
            </motion.div>
          )}

          {hasModuleAccess("inventory") && (
            <div
              onClick={() => toggleMenu("products")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/productes") ||
                pathName.startsWith("/categories") ||
                pathName.startsWith("/alertItems")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <Boxes />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Inventory
                </span>
              )}
              {!collapsed && (
                <motion.div
                  animate={{ rotate: openMenus["products"] ? 90 : 0 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}
          {openMenus["products"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("inventory", "categories", ["trigger"]) && (
                <SidebarLink
                  to="/categories"
                  icon={<Tags size={18} />}
                  text={t("sidebar.categories")}
                  collapsed={collapsed}
                  title={t("sidebar.categories")}
                />
              )}
              {hasPermission("inventory", "products", ["trigger"]) && (
                <SidebarLink
                  to="/productes"
                  icon={<Boxes size={18} />}
                  text={t("sidebar.products")}
                  collapsed={collapsed}
                  title={t("sidebar.products")}
                />
              )}
              {hasPermission("inventory", "alertItems", ["trigger"]) && (
                <SidebarLink
                  to="/alertItems"
                  icon={<AlertCircle size={16} />}
                  text={"Alert Items"}
                  collapsed={collapsed}
                  title={t("sidebar.alertItems")}
                />
              )}
            </motion.div>
          )}
          {hasModuleAccess("purchase") && (
            <div
              onClick={() => toggleMenu("purchase")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/purchase")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <PackagePlus />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Purchase
                </span>
              )}
              {!collapsed && (
                <motion.div
                  animate={{ rotate: openMenus["purchase"] ? 90 : 0 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["purchase"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <SidebarLink
                to="/purchase"
                icon={<PackagePlus size={18} />}
                text={t("sidebar.purchase")}
                collapsed={collapsed}
                title={t("sidebar.purchase")}
              />
              <SidebarLink
                to="/purchaseReturn"
                icon={<Undo2 size={16} />}
                text={"Purchase Return"}
                collapsed={collapsed}
                title={"Purchase Return"}
              />
              <SidebarLink
                to="/returnInvoice"
                icon={<Undo size={16} />}
                text={"Return Invoice"}
                collapsed={collapsed}
                title={"Return Invoice"}
              />
            </motion.div>
          )}

          {hasModuleAccess("customers") && (
            <div
              onClick={() => toggleMenu("customers")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/customers")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <Users />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Customers
                </span>
              )}
              {!collapsed && (
                <motion.div
                  animate={{ rotate: openMenus["customers"] ? 90 : 0 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["customers"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("customers", "customers", ["trigger"]) && (
                <SidebarLink
                  to="/customers"
                  icon={<Users size={18} />}
                  text={t("sidebar.customers")}
                  collapsed={collapsed}
                  title={t("sidebar.customers")}
                />
              )}
            </motion.div>
          )}

          {hasModuleAccess("supplier") && (
            <div
              onClick={() => toggleMenu("supplier")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/supplier")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <Truck />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Supplier
                </span>
              )}
              {!collapsed && (
                <motion.div
                  animate={{ rotate: openMenus["customers"] ? 90 : 0 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["supplier"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("supplier", "supplier", ["trigger"]) && (
                <SidebarLink
                  to="/supplier"
                  icon={<Truck size={18} />}
                  text={t("sidebar.supplier")}
                  collapsed={collapsed}
                  title={t("sidebar.supplier")}
                />
              )}
            </motion.div>
          )}

          {hasModuleAccess("expense") && (
            <div
              onClick={() => toggleMenu("expense")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/expense")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <Coins />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Expense
                </span>
              )}
              {!collapsed && (
                <motion.div animate={{ rotate: openMenus["expense"] ? 90 : 0 }}>
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["expense"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("expense", "expense", ["trigger"]) && (
                <SidebarLink
                  to="/expense"
                  icon={<Coins size={18} />}
                  text={t("sidebar.expense")}
                  collapsed={collapsed}
                  title={t("sidebar.expense")}
                />
              )}
            </motion.div>
          )}

          {/* {hasModuleAccess("accounts") && (
            <div
              onClick={() => toggleMenu("accounts")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/accounts")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <CircleDollarSign />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Accounts
                </span>
              )}
              {!collapsed && (
                <motion.div
                  animate={{ rotate: openMenus["accounts"] ? 90 : 0 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["accounts"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("accounts", "accounts", ["trigger"]) && (
                <SidebarLink
                  to="/accounts"
                  icon={<CircleDollarSign size={18} />}
                  text={"Accounts"}
                  collapsed={collapsed}
                  title={"Accounts"}
                />
              )}
            </motion.div>
          )}

          {hasModuleAccess("employee") && (
            <div
              onClick={() => toggleMenu("employee")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/employee")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <Briefcase />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Employee
                </span>
              )}
              {!collapsed && (
                <motion.div
                  animate={{ rotate: openMenus["employee"] ? 90 : 0 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["employee"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("employee", "employee", ["trigger"]) && (
                <SidebarLink
                  to="/employee"
                  icon={<Briefcase size={18} />}
                  text={"Employee"}
                  collapsed={collapsed}
                  title={"Employee"}
                />
              )}
            </motion.div>
          )} */}
          {hasModuleAccess("report") && (
            <div
              onClick={() => toggleMenu("report")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/report")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <ScrollText />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Report
                </span>
              )}
              {!collapsed && (
                <motion.div animate={{ rotate: openMenus["report"] ? 90 : 0 }}>
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["report"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("report", "report", ["trigger"]) && (
                <SidebarLink
                  to="/report"
                  icon={<ScrollText size={18} />}
                  text={t("sidebar.report")}
                  collapsed={collapsed}
                  title={t("sidebar.report")}
                />
              )}
            </motion.div>
          )}
          {hasModuleAccess("settings") && (
            <div
              onClick={() => toggleMenu("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                pathName.startsWith("/settings")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`}
            >
              <Settings />
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">
                  Settings
                </span>
              )}
              {!collapsed && (
                <motion.div
                  animate={{ rotate: openMenus["settings"] ? 90 : 0 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </div>
          )}

          {openMenus["settings"] && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {hasPermission("settings", "settings", ["trigger"]) && (
                <SidebarLink
                  to="/settings"
                  icon={<Settings size={18} />}
                  text={t("sidebar.settings")}
                  collapsed={collapsed}
                  title={t("sidebar.settings")}
                />
              )}
            </motion.div>
          )}

          {isDeveloper && (
            <>
              <div
                onClick={() => toggleMenu("usersAndPermission")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                  pathName.startsWith("users-management")
                    ? "bg-primary-700 text-white"
                    : "text-primary-200 hover:text-white hover:bg-primary-700/50"
                }`}
              >
                <Wrench />
                {!collapsed && (
                  <span className="flex-1 text-left whitespace-nowrap">
                    Users & Permission
                  </span>
                )}
                {!collapsed && (
                  <motion.div
                    animate={{
                      rotate: openMenus["usersAndPermission"] ? 90 : 0,
                    }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </div>

              {openMenus["usersAndPermission"] && !collapsed && (
                <motion.div
                  className="ml-8 mt-1 space-y-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDeveloper && (
                    <SidebarLink
                      to="/users-management"
                      icon={<Wrench size={18} />}
                      text="User Management"
                      collapsed={collapsed}
                      title="User Management"
                    />
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-700 mt-auto">
        {!collapsed && (
          <div className="text-sm text-primary-200">
            <p>{t("sidebar.appName")}</p>
            <p>{t("sidebar.version")} 1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
  title: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  text,
  collapsed,
  title,
}) => {
  return (
    <NavLink
      to={to}
      title={title}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-primary-700 text-white"
            : "text-primary-200 hover:text-white hover:bg-primary-700/50"
        }`
      }
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        {icon}
      </motion.div>
      {!collapsed && <span className="whitespace-nowrap">{text}</span>}
    </NavLink>
  );
};

export default Sidebar;
