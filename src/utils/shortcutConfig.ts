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
  "Shift+D": "dashboard",

  // Sales
  "Shift+R": "retailSale",
  "Shift+W": "wholeSale",
  "Shift+T": "transactions",
  "Shift+Q": "quotations",

  // Inventory
  "Shift+C": "categories",
  "Shift+P": "products",
  "Shift+A": "alertItems",

  // Purchase
  "Shift+U": "purchase",

  // Customers
  "Shift+M": "customers",

  // Supplier
  "Shift+L": "supplier",

  // Expense
  "Shift+E": "expense",

  // Accounts
  "Shift+O": "accounts",

  // Employee
  "Shift+Y": "employee",

  // Report
  "Shift+X": "report",

  // Settings
  "Shift+S": "settings",

  // Users & Permission
  "Shift+G": "userManagement",
};

export default sidebarShortcutConfig;
