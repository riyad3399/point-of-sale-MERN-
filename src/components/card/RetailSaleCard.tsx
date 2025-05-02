import { Minus, Plus } from "lucide-react";
import React from "react";

const RetailSaleCard: React.FC = ({ product, quantity, updateQuantity }) => {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <div>
        <p className="font-medium text-sm">{product.productName}</p>
        <p className="text-xs text-gray-500">
          ৳{product.retailPrice.toFixed(2)} each
        </p>
        <p className="font-semibold text-sm mt-1">
          ৳{(product.retailPrice * quantity).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => updateQuantity(id, -1)}>
          <Minus size={16} />
        </button>
        <span>{quantity}</span>
        <button onClick={() => updateQuantity(id, 1)}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default RetailSaleCard;
