// components/ThermalPrintButton.tsx
import { useState } from "react";
import qz from "qz-tray";

interface Product {
  name: string;
  quantity: number;
  price: number;
  status: string;
}

interface Company {
  storeName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

interface ThermalPrintButtonProps {
  companyInfo: Company;
  products: Product[];
  customerName: string;
  customerPhone: string;
  total: number;
  discount: number;
  payable: number;
  paid: number;
  due: number;
  change: number;
  paymentMethod: string;
  checkoutDate: string;
  dueDate?: string;
}

export default function ThermalPrintButton({
  companyInfo,
  products,
  customerName,
  customerPhone,
  total,
  discount,
  payable,
  paid,
  due,
  change,
  paymentMethod,
  checkoutDate,
  dueDate,
}: ThermalPrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const rightAlign = (label: string, amount: number) =>
    `${label.padEnd(12)}৳ ${amount.toFixed(2).padStart(8)}\n`;

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await qz.websocket.connect();

      const printer = await qz.printers.find();
      if (!printer) {
        throw new Error("কোনো প্রিন্টার খুঁজে পাওয়া যায়নি।");
      }

      const config = qz.configs.create(printer);
      const data: string[] = [];

      // Header
      data.push("\x1B\x40"); // Init
      data.push("\x1B\x61\x01"); // Center
      data.push(`${companyInfo.storeName}\n`);
      data.push(`${companyInfo.address}, ${companyInfo.city}\n`);
      data.push(`Phone: ${companyInfo.phone}\n`);
      data.push(`Email: ${companyInfo.email}\n`);
      data.push("------------------------------------------\n");

      // Customer Info
      data.push("\x1B\x61\x00"); // Left
      data.push(`Date: ${checkoutDate}\n`);
      data.push(`Payment: ${paymentMethod}\n`);
      data.push(`Name: ${customerName}\n`);
      data.push(`Phone: ${customerPhone}\n`);
      data.push("------------------------------------------\n");

      // Products
      data.push("Item              Qty  Price   Status\n");
      products.forEach((item) => {
        const name = item.name.slice(0, 16).padEnd(17);
        const qty = String(item.quantity).padStart(2).padEnd(4);
        const price = `৳${item.price.toFixed(2)}`.padStart(7).padEnd(9);
        const status = item.status.slice(0, 6);
        data.push(`${name}${qty}${price}${status}\n`);
      });

      // Totals
      data.push("------------------------------------------\n");
      data.push(rightAlign("Total:", total));
      data.push(rightAlign("Discount:", discount));
      data.push(rightAlign("Payable:", payable));
      data.push(rightAlign("Paid:", paid));
      data.push(rightAlign("Due:", due));
      if (due > 0 && dueDate) {
        data.push(`Due Date:   ${dueDate}\n`);
      }
      if (change > 0) {
        data.push(rightAlign("Change:", change));
      }

      // Footer
      data.push("\nThank you for your purchase!\n\n");
      data.push("\x1D\x56\x00"); // Cut

      await qz.print(config, data);
    } catch (err) {
      alert("থার্মাল প্রিন্ট ব্যর্থ হয়েছে। QZ Tray চালু আছে কি না চেক করুন।");
      console.error(err);
    } finally {
      setIsPrinting(false);
      if (qz.websocket.isActive()) {
        await qz.websocket.disconnect();
      }
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={isPrinting}
      className="bg-blue-600 text-white px-4 py-2 rounded print:hidden disabled:opacity-50"
    >
      {isPrinting ? "প্রিন্ট হচ্ছে..." : "🖨️ থার্মাল প্রিন্ট"}
    </button>
  );
}
