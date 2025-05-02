// Product types
export interface Product {
  _id: string;
  productName: string;
  productCode: number;
  description: string;
  brand: string;
  category: string;
  unit: string;
  quantity: number;
  alertQuantity: number;
  purchasePrice: number;
  wholesalePrice: number;
  retailPrice: number;
  tax: number;
  taxType: "inclusive" | "exclusive";
}

// export interface Product {
//   _id?: string; // Optional, if using MongoDB ObjectId
//   productName: string;
//   category: "electronics" | "clothing" | "groceries";
//   brand?: string;
//   purchasePrice: number;
//   retailPrice: number;
//   wholesalePrice: number;
//   quantity: number;
//   alertQuantity?: number;
//   unit: "pcs" | "kg" | "ltr";
//   tax?: number;
//   taxType?: "inclusive" | "exclusive";
//   description?: string;
//   photo?: string;
//   productCode?: number; // Will be auto-generated
//   __v?: number; // Mongoose version key
// }


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
  status: 'completed' | 'refunded' | 'voided';
  notes?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'cashier' | 'manager';
  avatar?: string;
  isActive: boolean;
}