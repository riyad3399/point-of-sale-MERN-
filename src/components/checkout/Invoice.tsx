import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Printer } from "lucide-react";
import axios from "axios";

interface Product {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  customerName?: string;
  phone?: string;
}

interface InvoiceProps {
  transactionId: number;
  checkoutDate: string;
  paymentMethod: string;
  products: Product[];
  totalAmount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate?: string;
  selectWalking?: Customer;
  customers: Customer[];
  saleSystemValue: string;
}

const Invoice: React.FC<InvoiceProps> = ({
  checkoutDate,
  saleSystemValue,
  paymentMethod,
  products,
  totalAmount,
  discount,
  paidAmount,
  dueAmount,
  dueDate,
  selectWalking,
  customers,
}) => {
  const payable = totalAmount - discount;
  const balance = paidAmount - payable;
  // console.log(products);

  // Prevent duplicate saving
  const invoicePostedRef = useRef(false);

  useEffect(() => {
    if (!selectWalking || products.length === 0 || invoicePostedRef.current)
      return;

    const saveInvoice = async () => {
      invoicePostedRef.current = true; // ✅ Prevent multiple posts
      const payable = totalAmount - discount;
      const balance = paidAmount - payable;
      const due = payable > paidAmount ? payable - paidAmount : 0;
      const change = balance > 0 ? balance : 0;

      try {
        const response = await axios.post("http://localhost:3000/invoice", {
          saleSystem: saleSystemValue,
          customer: {
            name: selectWalking.customerName || "Walking Customer",
            phone: selectWalking.phone || "N/A",
          },
          paymentMethod,
          items: products.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
          totals: {
            total: totalAmount,
            discount,
            payable,
            paid: paidAmount,
            due,
            change,
          },
          dueDate: due > 0 ? dueDate : null,
        });

        console.log("✅ Invoice saved:");
        console.log(response);
      } catch (error) {
        console.error("❌ Error saving invoice:", error);
        invoicePostedRef.current = false; // Retry allowed if error
      }
    };

    saveInvoice();
  }, [selectWalking, products]);

  return (
    <motion.div
      id="invoice-print"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl mt-2 max-w-md w-full mx-auto print:max-w-none print:shadow-none print:p-0 print:rounded-none print:bg-white print:px-3"
    >
      <div className="space-y-4 print:text-black">
        <h2 className="text-xl font-bold text-left">Invoice</h2>

        <div className="flex items-center justify-between">
          <div className="text-sm space-y-1">
            <p>
              Date: <span className="font-medium">{checkoutDate}</span>
            </p>
            <p>
              Payment:{" "}
              <span className="font-medium capitalize">{paymentMethod}</span>
            </p>
          </div>
          <div>
            <h4 className="text-sm">
              <span className="font-semibold">Name:</span>{" "}
              {selectWalking?.customerName || "Walking Customer"}
            </h4>
            <h4 className="text-sm">
              <span className="font-semibold">Phone:</span>{" "}
              {selectWalking?.phone || "N/A"}
            </h4>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm mb-2">Items</h3>
          <ul className="divide-y max-h-[116px] overflow-y-auto print:overflow-visible">
            {products.map((item, index) => (
              <li key={index} className="py-1 flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>৳ {(item.quantity * item.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total</span>
            <span>৳ {totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>- ৳ {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Payable</span>
            <span>৳ {payable.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid</span>
            <span>৳ {paidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Due</span>
            <span>৳ {dueAmount.toFixed(2)}</span>
          </div>

          {dueAmount > 0 && dueDate && (
            <div className="flex justify-between text-red-600">
              <span>Due Date</span>
              <span>{dueDate}</span>
            </div>
          )}

          {balance > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Change</span>
              <span>৳ {balance.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end print:hidden">
          <motion.button
            onClick={() => window.print()}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center gap-2  text-white px-3 py-2 mb-2 rounded-xl shadow-md  btn-primary transition-all duration-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice;
