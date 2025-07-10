// Product types
export interface Product {
  _id: string;
  productName: string;
  description: string;
  productCode: number;
  category: string;
  brand: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  alertQuantity: number;
  unit: string;
  tax: number | null;
  taxType: "inclusive" | "exclusive" | string;
  Description: string;
  subType: string;
  size?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  fifoStock: {
    purchasePrice: number;
    remainingQuantity: number;
    purchaseDate: string;
  }[];
}

// Cart types

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Transaction types
export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashierName: string;
  timestamp: string;
  status: "completed" | "refunded" | "voided";
  notes?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "cashier" | "manager";
  avatar?: string;
  isActive: boolean;
}

// invoice type
export interface InvoiceType {
  _id: string;
  transactionId: number;
  createdAt: string;
  dueDate: string;
  nextDueDate?: string;
  updatedAt: string;
  customer: { name: string; phone: string };
  paymentMethod: string;
  saleSystem: string;
  items: { name: string; quantity: number; price: number; status: string }[];
  totals: {
    total: number;
    discount: number;
    payable: number;
    paid: number;
    due: number;
  };
  paymentDetails?: {
    _id: string;
    currentPaymentDate: string;
    discount: number;
    paid: number;
    nextDueAmount: number;
    nextDueDate: string;
  }[];
}

// store information
export interface FormValues {
  storeName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  taxRate: number;
  currency: string;
  logo: FileList;
}

export type OptionType = {
  value: number;
  label: string;
  customerName: string;
  phone: string;
};

export interface QuotationType {
  _id: string;
  quotationId: number;
  customer: OptionType;
  items: {
    name: string;
    price: number;
    productId: string;
    quantity: number;
  }[];
  saleType: "retailSale" | "wholeSale";
  shippingCost?: number;
  createdAt: string;
  updatedAt: string;
}

// Company Type
export interface CompanyType {
  _id: string;
  storeName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  currency: string;
  logo: string;
  taxRate: number | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// --- Interfaces and Types ---
export interface Purchase {
  _id: string;
  supplier: {
    _id: string;
    name: string;
    phone?: string;
  };
  total: number;
  paid: number;
  due: number;
  paymentMethod: string;
  date: string;
  items: {
    product: {
      _id: string;
      productId: string;
      quantity: number;
      purchasePrice: number;
    };
  }[];
}

// supplier
export interface Supplier {
  _id: string;
  supplierId: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Expense
export interface Item {
  category?: string;
  remarks?: string;
  unitPrice: number;
  quantity: number;
}

export interface Expense {
  _id: string;
  date: string;
  method?: "CASH" | "BKASH" | "BANK";
  items: Item[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInfo {
  _id?: string;
  userName: string;
  password: string;
  confirmPassword?: string;
}

export type PermissionsProps = {
  permissions: string[];
  token: string | null;
  userId: string;
  onUpdated: (onUpdated: any) => void;
};

export type RoleProps = {
  roles: string[];
  userId: string;
  token: string | null;
};


// ----------------------- User Management------------------------//

interface CRUDPermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface UserPermissions {
  sales: {
    trigger: boolean;
    retailSale: CRUDPermission;
    wholeSale: CRUDPermission;
    transactions: CRUDPermission;
    quotations: CRUDPermission;
  };
  inventory: {
    trigger: boolean;
    categories: CRUDPermission;
    products: CRUDPermission;
    alertItems: CRUDPermission;
  };
  purchase: {
    trigger: boolean;
    purchase: CRUDPermission;
  };
  customers: {
    trigger: boolean;
    customers: CRUDPermission;
  };
  supplier: {
    trigger: boolean;
    supplier: CRUDPermission;
  };
  expense: {
    trigger: boolean;
    expense: CRUDPermission;
  };
  accounts: {
    trigger: boolean;
    accounts: CRUDPermission;
  };
  employee: {
    trigger: boolean;
    employee: CRUDPermission;
  };
  report: {
    trigger: boolean;
    report: CRUDPermission;
  };
  settings: {
    trigger: boolean;
    settings: CRUDPermission;
  };
  usersAndPermission: {
    trigger: boolean;
    userManagement: CRUDPermission;
  };
}

