// src/utils/shortcutConfig.ts

export type ShortcutAction =
  | "newOrderTab"
  | "todayOrderTab"
  | "placeOrder"
  | "searchProduct"
  | "selectCustomerType"
  | "editServiceCharge"
  | "selectTable"
  | "searchTodayOrder"
  | "updateSelectCustomerType"
  | "updateServiceCharge"
  | "updateSubmitForm"
  | "payAndPrintBill"
  | "onGoingTab"
  | "onlineOrderTab"
  | "quickOrder"
  | "selectCustomer"
  | "editDiscount"
  | "selectWaiter"
  | "cookingTime"
  | "goEdit"
  | "searchOnlineOrder"
  | "updateSelectedCustomer"
  | "updateDiscount"
  | "updateSelectTable"
  | "selectPaymentType"
  | "paidAmountTyping";

const shortcutConfig: Record<string, ShortcutAction> = {
  // Left side
  "Shift+N": "newOrderTab",
  "Shift+T": "todayOrderTab",
  "Shift+P": "placeOrder",
  "Shift+S": "searchProduct",
  "Shift+Y": "selectCustomerType",
  "Shift+R": "editServiceCharge",
  "Shift+B": "selectTable",
  "Shift+X": "searchTodayOrder",
  "Alt+Y": "updateSelectCustomerType",
  "Alt+R": "updateServiceCharge",
  "Alt+U": "updateSubmitForm",
  "Alt+P": "payAndPrintBill",

  // Right side
  "Shift+G": "onGoingTab",
  "Shift+O": "onlineOrderTab",
  "Shift+Q": "quickOrder",
  "Shift+C": "selectCustomer",
  "Shift+D": "editDiscount",
  "Shift+W": "selectWaiter",
  "Alt+K": "cookingTime",
  "Alt+E": "goEdit",
  "Shift+V": "searchOnlineOrder",
  "Alt+C": "updateSelectedCustomer",
  "Alt+D": "updateDiscount",
  "Alt+B": "updateSelectTable",
  "Alt+M": "selectPaymentType",
  "Alt+A": "paidAmountTyping",
};

export default shortcutConfig;
