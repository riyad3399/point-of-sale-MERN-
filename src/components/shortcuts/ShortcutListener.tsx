import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sidebarShortcutConfig, {
  SidebarShortcutAction,
} from "../../utils/shortcutConfig";

export default function SidebarShortcutListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let combo = "";
      if (e.shiftKey) combo += "Shift+";
      if (e.altKey) combo += "Alt+";
      combo += e.key.toUpperCase();

      const actionName = sidebarShortcutConfig[combo];

      if (actionName) {
        e.preventDefault();

        // map sidebar shortcut actions -> routes
        const routeMap: Record<SidebarShortcutAction, string> = {
          dashboard: "/",

          // Sales
          retailSale: "/retailSale",
          wholeSale: "/wholeSale",
          transactions: "/transactions",
          quotations: "/quotation",

          // Inventory
          categories: "/categories",
          products: "/productes",
          alertItems: "/alertItems",

          // Purchase
          purchase: "/purchase",

          // Customers
          customers: "/customers",

          // Supplier
          supplier: "/supplier",

          // Expense
          expense: "/expense",

          // Accounts
          accounts: "/accounts",

          // Employee
          employee: "/employees",

          // Report
          report: "/report",

          // Settings
          settings: "/settings",

          // User Management
          userManagement: "/users-management",
        };

        navigate(routeMap[actionName]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null; // এটা শুধু listener, UI render করবে না
}
