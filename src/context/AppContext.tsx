import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Product, CartItem, Transaction, User } from "../types";
import {
  sampleProducts,
  sampleCategories,
  sampleUsers,
} from "../data/sampleData";

interface AppContextProps {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Products and categories
  products: Product[];
  categories: string[];

  // Cart functionality
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Checkout
  cartTotal: number;
  taxAmount: number;
  grandTotal: number;
  checkout: (paymentMethod: string) => Promise<Transaction>;

  // Transactions
  transactions: Transaction[];
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Data state
  const [products] = useState<Product[]>(sampleProducts);
  const [categories] = useState<string[]>(sampleCategories);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Calculate cart totals
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const taxRate = 0.07; // 7% tax
  const taxAmount = cartTotal * taxRate;
  const grandTotal = cartTotal + taxAmount;

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = sampleUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // Create a sanitized user object (without password)
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword as User);
          setIsAuthenticated(true);
          // Save to localStorage
          localStorage.setItem(
            "currentUser",
            JSON.stringify(userWithoutPassword)
          );
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  // Cart functions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      // Check if product is already in cart
      const itemIndex = prevCart.findIndex(
        (item) => item.productId === product.id
      );

      if (itemIndex >= 0) {
        // Update quantity if already in cart
        const updatedCart = [...prevCart];
        updatedCart[itemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: uuidv4(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout function
  const checkout = async (paymentMethod: string): Promise<Transaction> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction: Transaction = {
          id: uuidv4(),
          items: [...cart],
          subtotal: cartTotal,
          tax: taxAmount,
          total: grandTotal,
          paymentMethod,
          cashierName: currentUser?.name || "Unknown",
          timestamp: new Date().toISOString(),
          status: "completed",
        };

        setTransactions((prev) => [transaction, ...prev]);
        clearCart();
        resolve(transaction);
      }, 1000);
    });
  };

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        // Auth
        currentUser,
        isAuthenticated,
        login,
        logout,

        // Products and categories
        products,
        categories,

       


        // Transactions
        transactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
