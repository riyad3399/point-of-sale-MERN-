import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Printer } from "lucide-react";
import axios from "axios";
import { CompanyType } from "../../types";
import ThermalPrintButton from "../printButton/ThermalPrintButton";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface Product {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  purchasePrice: number;
  status: string;
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

  const invoicePostedRef = useRef(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyType | null>();
  const { token, user } = useAuth();

  useEffect(() => {
    if (!selectWalking || products.length === 0 || invoicePostedRef.current)
      return;

    const saveInvoice = async () => {
      invoicePostedRef.current = true;
      const payable = totalAmount - discount;
      const balance = paidAmount - payable;
      const due = payable > paidAmount ? payable - paidAmount : 0;
      const change = balance > 0 ? balance : 0;

      try {
        const response = await axios.post(
          "http://localhost:3000/invoice",
          {
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
              purchasePrice: item.purchasePrice,
              total: item.quantity * item.price,
              status: item.status,
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
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(
          `Invoice #${response.data.transactionId} Created successful!`
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create invoice."
        );

        invoicePostedRef.current = false;
      }
    };

    saveInvoice();
  }, [selectWalking, products]);

  const fetchCompanyInfo = async () => {
    const res = await axios.get("http://localhost:3000/setting", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data.data;
    setCompanyInfo(data);
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  return (
    <motion.div
      id="invoice-print"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl mt-2 max-w-lg print:max-w-none print:p-10 max-h-[85vh] overflow-y-auto w-full mx-auto print:shadow-none print:rounded-none print:bg-white "
    >
      <div className="space-y-4 print:text-black p-4 print:p-0">
        {/* Header with logo and company info */}
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-2">
            <img
              src={companyInfo?.logo}
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="text-right text-sm">
            <h2 className="text-lg font-bold">{companyInfo?.storeName}</h2>
            <p>
              {companyInfo?.address}, {companyInfo?.city}
            </p>
            <p>Phone: {companyInfo?.phone}</p>
            <p>Email: {companyInfo?.email}</p>
          </div>
        </div>

        {/* Invoice title and customer/payment info */}
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
          <div className="text-sm text-right">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {selectWalking?.customerName || "Walking Customer"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {selectWalking?.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* Items table */}
        <div className="max-h-[200px] overflow-y-auto border rounded custom-scroll print:overflow-hidden print:max-h-full">
          <table className="w-full text-sm table-auto">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-center">Price</th>
                {user.tenantId !== "riyad" ? <th className="p-2 text-right">Status</th> : ""}
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 text-left">{item.name}</td>
                  <td className="p-2 text-left">{item.quantity}</td>
                  <td className="p-2 text-center">৳ {item.price}</td>
                  {user.tenantId !== "riyad" ? <td className="p-2 text-right">{item.status}</td> : ""}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
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

        {/* Print button */}
        <div className="pt-2 flex justify-end print:hidden">
          <motion.button
            onClick={() => window.print()}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center gap-2 text-white px-3 py-2 mb-2 rounded-xl shadow-md btn-primary transition-all duration-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </motion.button>
          <ThermalPrintButton
            companyInfo={{
              storeName: companyInfo?.storeName || "",
              address: companyInfo?.address || "",
              city: companyInfo?.city || "",
              phone: companyInfo?.phone || "",
              email: companyInfo?.email || "",
            }}
            products={products}
            customerName={selectWalking?.customerName || "Walking Customer"}
            customerPhone={selectWalking?.phone || "N/A"}
            total={totalAmount}
            discount={discount}
            payable={payable}
            paid={paidAmount}
            due={dueAmount}
            change={balance}
            paymentMethod={paymentMethod}
            checkoutDate={checkoutDate}
            dueDate={dueDate}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice;
