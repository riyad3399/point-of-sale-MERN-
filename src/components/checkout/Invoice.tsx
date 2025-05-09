import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Printer, X } from "lucide-react";
import axios from "axios";

interface Product {
  name: string;
  quantity: number;
  price: number;
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
}

const Invoice: React.FC<InvoiceProps> = ({
  transactionId,
  checkoutDate,
  paymentMethod,
  products,
  totalAmount,
  discount,
  paidAmount,
  dueAmount,
  dueDate,
  selectWalking,
  customers,
  addedCustomer,
}) => {
  const payable = totalAmount - discount;
  const balance = paidAmount - payable;
  console.log("walkink", selectWalking);

 useEffect(() => {
   if (!selectWalking?.phone) return;

   const found = customers.find((c) => c.phone === selectWalking.phone);
   const phone = found?.phone;

   if (phone) {
     axios
       .get(`http://localhost:3000/customer/${phone}`)
       .then((res) => console.log(res.data))
       .catch((err) => console.error("Fetch error:", err));
   }
 }, [selectWalking, customers]);


  return (
    <motion.div
      id="invoice-print"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className=" bg-white rounded-xl mt-2 max-w-md w-full mx-auto print:max-w-none print:shadow-none print:p-0 print:rounded-none print:bg-white print:px-3"
    >
      <div className="space-y-4 print:text-black">
        <h2 className="text-xl font-bold text-left">Invoice</h2>

        <div className="flex items-center justify-between">
          <div className="text-sm space-y-1">
            <p>
              Transaction ID:{" "}
              <span className="font-medium">{transactionId}</span>
            </p>
            <p>
              Date: <span className="font-medium">{checkoutDate}</span>
            </p>
            <p>
              Payment:{" "}
              <span className="font-medium capitalize">{paymentMethod}</span>
            </p>
          </div>
          <div className="">
            <h4 className="">{ selectWalking?.customerName}</h4>
            <h4>{selectWalking?.phone}</h4>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm mb-2">Items</h3>
          <ul className="divide-y max-h-[116px] print:max-h-full overflow-y-auto print:overflow-visible">
            {products?.map((item, index) => (
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

        {/* Print Button (Hidden on print) */}
        <div className="pt-2 flex justify-end print:hidden">
          <motion.button
            onClick={() => window.print()}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 mb-2 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 "
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
