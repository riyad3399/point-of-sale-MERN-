// src/utils/sidebarShortcutConfig.ts

export type SidebarShortcutAction =
  | "dashboard"
  | "retailSale"
  | "wholeSale"
  | "transactions"
  | "quotations"
  | "categories"
  | "products"
  | "alertItems"
  | "purchase"
  | "customers"
  | "supplier"
  | "expense"
  | "accounts"
  | "employee"
  | "report"
  | "settings"
  | "userManagement";

const sidebarShortcutConfig: Record<string, SidebarShortcutAction> = {
  "Alt+D": "dashboard",

  // Sales
  "Alt+R": "retailSale",
  "Alt+W": "wholeSale",
  "Alt+T": "transactions",
  "Alt+Q": "quotations",

  // Inventory
  "Alt+C": "categories",
  "Alt+P": "products",
  "Alt+A": "alertItems",

  // Purchase
  "Alt+U": "purchase",

  // Customers
  "Alt+M": "customers",

  // Supplier
  "Alt+L": "supplier",

  // Expense
  "Alt+E": "expense",

  // Accounts
  "Alt+O": "accounts",

  // Employee
  "Alt+Y": "employee",

  // Report
  "Alt+X": "report",

  // Settings
  "Alt+S": "settings",

  // Users & Permission
  "Alt+G": "userManagement",
};

export default sidebarShortcutConfig;
