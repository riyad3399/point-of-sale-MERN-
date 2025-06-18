import Swal from "sweetalert2";
import { Product } from "../types";

export interface CartItem {
  id: string;
  quantity: number;
}


// Main addToCart function
export const addToCart = (
  id: string,
  getProductById: (id: string) => Product | undefined,
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  cart: CartItem[]
) => {
  const product = getProductById(id);
  if (!product) return;

  if (product.quantity === 0) {
    Swal.fire({
      icon: "error",
      title: "Stock Out!",
      text: "এই পণ্যটি স্টকে নেই।",
    });
    return;
  }

  const existingItem = cart.find((item) => item.id === id);
  const currentQty = existingItem?.quantity || 0;

  if (currentQty >= product.quantity) {
    Swal.fire({
      icon: "warning",
      title: "স্টকে পণ্য নেই",
      text: `সর্বোচ্চ ${product.quantity}টি পণ্য স্টকে আছে!`,
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  const updatedCart = existingItem
    ? cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...cart, { id, quantity: 1 }];

  setCart(updatedCart);
};
