import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BiLogoProductHunt } from "react-icons/bi";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Settings,
  Users,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Notebook,
  Coins,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { MdCategory } from "react-icons/md";
import { useTranslation } from "react-i18next";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    setCollapsed(pathName === "/retailSale" || pathName === "/wholeSale");
    setReportOpen(pathName.startsWith("/report"));
  }, [pathName]);

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
            <img src={"/photo/logo.png"} alt="Logo" className=" w-[85%]" />
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
      <nav className="flex-1 pt-4 px-2">
        <div className="space-y-1">
          <SidebarLink
            to="/"
            icon={<LayoutDashboard />}
            text={t("sidebar.dashboard")}
            collapsed={collapsed}
            title={t("sidebar.dashboard")}
          />
          <SidebarLink
            to="/categories"
            icon={<MdCategory size={24} />}
            text={t("sidebar.categories")}
            collapsed={collapsed}
            title={t("sidebar.categories")}
          />
          <SidebarLink
            to="/productes"
            icon={<BiLogoProductHunt size={22} />}
            text={t("sidebar.products")}
            collapsed={collapsed}
            title={t("sidebar.products")}
          />
          <SidebarLink
            to="/retailSale"
            icon={<ShoppingCart />}
            text={t("sidebar.retailSale")}
            collapsed={collapsed}
            title={t("sidebar.retailSale")}
          />
          <SidebarLink
            to="/wholeSale"
            icon={<ShoppingCart />}
            text={t("sidebar.wholeSale")}
            collapsed={collapsed}
            title={t("sidebar.wholeSale")}
          />
          <SidebarLink
            to="/quotation"
            icon={<Notebook />}
            text={t("sidebar.quotations")}
            collapsed={collapsed}
            title={t("sidebar.quotations")}
          />
          <SidebarLink
            to="/transactions"
            icon={<FileText />}
            text={t("sidebar.transactions")}
            collapsed={collapsed}
            title={t("sidebar.transactions")}
          />
          <SidebarLink
            to="/customers"
            icon={<Users />}
            text={t("sidebar.customers")}
            collapsed={collapsed}
            title={t("sidebar.customers")}
          />
          <SidebarLink
            to="/expense"
            icon={<Coins />}
            text={t("sidebar.expense")}
            collapsed={collapsed}
            title={t("sidebar.expense")}
          />
          <SidebarLink
            to="/purchase"
            icon={<ShoppingBag />}
            text={"Purchase"}
            collapsed={collapsed}
            title={"Purchase"}
          />
          <SidebarLink
            to="/supplier"
            icon={<Truck />}
            text={"Supplier"}
            collapsed={collapsed}
            title={"Supplier"}
          />

          {/* Report Dropdown */}
          <NavLink
            to="/report"
            onClick={() => setReportOpen(!reportOpen)}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                pathName.startsWith("/report")
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:text-white hover:bg-primary-700/50"
              }`
            }
          >
            <ScrollText />
            {!collapsed && (
              <span className="flex-1 text-left whitespace-nowrap">
                {t("sidebar.report")}
              </span>
            )}
            {!collapsed && (
              <motion.div animate={{ rotate: reportOpen ? 90 : 0 }}>
                <ChevronRight size={16} />
              </motion.div>
            )}
          </NavLink>

          {reportOpen && !collapsed && (
            <motion.div
              className="ml-8 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <SidebarLink
                to="/alertItems"
                icon={<AlertCircle size={16} />}
                text={"Alert Items"}
                collapsed={collapsed}
                title={t("sidebar.alertItems")}
              />
            </motion.div>
          )}

          <SidebarLink
            to="/settings"
            icon={<Settings />}
            text={t("sidebar.settings")}
            collapsed={collapsed}
            title={t("sidebar.settings")}
          />
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
