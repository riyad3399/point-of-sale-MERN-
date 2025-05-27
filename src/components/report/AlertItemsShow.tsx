import React from "react";
import { motion } from "framer-motion";

type Product = {
  _id: string;
  productName: string;
  productCode: number;
  category: string;
  brand: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  alertQuantity: number;
  unit: string;
  tax: number;
  taxType: string;
  Description: string;
  updatedAt: string;
  color?: string;
  size?: string;
  photo?: { data: number[]; type: string };
};

type Props = {
  products: Product[];
};

const AlertItemsShow: React.FC<Props> = ({ products }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto rounded-2xl shadow-xl bg-white p-4"
    >
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-2">Photo</th>
            <th className="px-4 py-2"> Name</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Alert</th>
            <th className="px-4 py-2">Retail Price</th>
            <th className="px-4 py-2">Wholesale</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={
                product.quantity <= product.alertQuantity
                  ? "bg-red-50"
                  : "hover:bg-gray-50"
              }
            >
              <td className="px-4 py-2">
                {product.photo?.data ? (
                  <img
                    src={`http://localhost:3000/product/image/${product._id}`}
                    alt={product.productName}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-300 rounded" />
                )}
              </td>
              <td className="px-4 py-2">
                <div>
                  <div className="font-medium">{product.productName}</div>
                  <div className="text-xs text-gray-500">
                    {product.size && <span>Size: {product.size}</span>}
                    {product.size && product.color && <span> • </span>}
                    {product.color && <span>Color: {product.color} </span>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 text-center">{product.productCode}</td>
              <td className="px-4 py-2 text-center">{product.quantity}</td>
              <td className="px-4 py-2 text-center">{product.alertQuantity}</td>
              <td className="px-4 py-2 text-center">৳{product.retailPrice}</td>
              <td className="px-4 py-2 text-center">
                ৳{product.wholesalePrice}
              </td>
              <td className="px-4 py-2 text-center">{product.unit}</td>
              <td className="px-4 py-2 text-center">
                {new Date(product.updatedAt).toLocaleDateString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default AlertItemsShow;
