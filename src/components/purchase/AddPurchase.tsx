import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import SupplierAddForm from "../supplier/SupplierAddForm";
import FloatingInput from "./FloatingInput";
import { useTranslation } from "react-i18next";
import CreatableSelect from "react-select/creatable";

import {
  handleGetProduct,
  handleGetSupplier,
  handleInsertPurchase,
} from "../../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface Supplier {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Product {
  _id: string;
  productName: string;
  quantity: number;
  purchasePrice: number;
  retailPrice?: number;
  wholesalePrice?: number;
}

interface PurchaseFormData {
  supplier: Supplier | null;
  items: {
    product: string;
    quantity: number;
    purchasePrice: number;
    retailPrice?: number;
    wholesalePrice?: number;
  }[];
  invoiceNumber?: string;
  paid: number;
  discount?: number;
  shippingCost?: number;
  paymentMethod: string;
  status: "Order" | "Pending" | "Received";
  dueDate?: string;
  purchaseDate?: string;
}

const PurchaseForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    defaultValues: {
      supplier: null,
      items: [
        {
          product: "",
          quantity: 1,
          purchasePrice: 0,
          retailPrice: 0,
          wholesalePrice: 0,
        },
      ],
      paid: 0,
      discount: 0,
      shippingCost: 0,
      paymentMethod: "Cash",
      status: "Order",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const items = watch("items");
  const paid = watch("paid") || 0;
  const discount = watch("discount") || 0;
  const shippingCost = watch("shippingCost") || 0;
  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.purchasePrice,
    0
  );
  const discountPercent = discount || 0;
  const discountAmount = (total * discountPercent) / 100;
  const grandTotal = total - discountAmount + shippingCost;
  const due = grandTotal - paid;

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const { t } = useTranslation();
  const {token} = useAuth()

  useEffect(() => {
    handleGetProduct(setProducts, token);
    handleGetSupplier(setSuppliers);
  }, [token]);

const onSubmit = async (data: PurchaseFormData) => {
  // 1️⃣ Calculate total
  const total = data.items.reduce(
    (acc, item) => acc + item.quantity * item.purchasePrice,
    0
  );

  // 2️⃣ Discount handling
  const discountPercent = data.discount || 0;
  const discount = (total * discountPercent) / 100;

  // 3️⃣ Shipping cost
  const transportCost = data.shippingCost || 0;

  // 4️⃣ Final total
  const grandTotal = total - discount + transportCost;
  const due = grandTotal - (data.paid || 0);

  // 5️⃣ Validations
  if (!data.supplier) {
    return toast.error("Supplier is required");
  }
  if (due < 0) {
    return toast.error("Paid amount cannot be more than grand total");
  }
  if (!data.items.length || data.items.some((item) => !item.product)) {
    return toast.error("At least one valid product is required");
  }

  // 6️⃣ Transform data for backend
  const transformed = {
    supplierId: data.supplier._id, // শুধু ID দরকার backend এ
    supplierName: data.supplier.name, 
    items: data.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      purchasePrice: item.purchasePrice,
      retailPrice: item.retailPrice,
      wholesalePrice: item.wholesalePrice,
    })),
    total,
    discountPercent,
    discount,
    transportCost, // backend এর সাথে match
    grandTotal,
    paid: data.paid,
    due,
    paymentMethod: data.paymentMethod,
    status: data.status,
    dueDate: data.dueDate,
    purchaseDate: data.purchaseDate || new Date(),
  };

  console.log("Purchase payload 👉", transformed);

  handleInsertPurchase(reset, transformed);
};


  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Purchase Entry</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4 items-center mb-8">
          <div>
            <Controller
              control={control}
              name="supplier"
              render={({ field }) => (
                <Select
                  value={
                    field.value
                      ? { label: field.value.name, value: field.value._id }
                      : null
                  }
                  onChange={(opt) => {
                    if (opt?.value === "add_new") {
                      setShowSupplierModal(true);
                      return;
                    }
                    const selected = suppliers.find(
                      (s) => s._id === opt?.value
                    );
                    if (selected) field.onChange(selected);
                  }}
                  options={[
                    ...suppliers.map((s) => ({ label: s.name, value: s._id })),
                    { label: "➕ Add New", value: "add_new" },
                  ]}
                  placeholder="Select Supplier"
                />
              )}
            />
          </div>
        </div>

        {/* Product Items */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid lg:grid-cols-7 gap-4 lg:gap-2 items-center"
          >
            <CreatableSelect
              value={
                products.find((p) => p._id === items[index].product)
                  ? {
                      label: products.find(
                        (p) => p._id === items[index].product
                      )?.productName,
                      value: items[index].product,
                    }
                  : null
              }
              onChange={(opt) => {
                setValue(`items.${index}.product`, opt?.value || "");
                const selected = products.find((p) => p._id === opt?.value);
                if (selected) {
                  setValue(
                    `items.${index}.purchasePrice`,
                    selected.purchasePrice
                  );
                  setValue(
                    `items.${index}.retailPrice`,
                    selected.retailPrice || 0
                  );
                  setValue(
                    `items.${index}.wholesalePrice`,
                    selected.wholesalePrice || 0
                  );
                }
              }}
              options={products.map((p) => ({
                label: p.productName,
                value: p._id,
              }))}
              onCreateOption={(inputValue) => {
                // নতুন product তৈরি
                const newProduct = {
                  _id: Date.now().toString(), // temp id
                  productName: inputValue,
                  quantity: 1,
                  purchasePrice: 0,
                  retailPrice: 0,
                  wholesalePrice: 0,
                };
                setProducts((prev) => [...prev, newProduct]); // state এ যোগ
                setValue(`items.${index}.product`, newProduct._id); // form এ বসাও
              }}
              className="col-span-2"
              placeholder="Select or Create Product"
            />
            <FloatingInput
              id={`qty-${index}`}
              label={t("purchase.quantity")}
              type="number"
              registerProps={register(`items.${index}.quantity`, {
                valueAsNumber: true,
              })}
            />

            <FloatingInput
              id={`purchase-${index}`}
              label={t("purchase.purchasePrice")}
              type="number"
              registerProps={register(`items.${index}.purchasePrice`, {
                valueAsNumber: true,
              })}
            />

            <FloatingInput
              id={`retail-${index}`}
              label={t("purchase.retailPrice")}
              type="number"
              registerProps={register(`items.${index}.retailPrice`, {
                valueAsNumber: true,
              })}
            />

            <FloatingInput
              id={`wholesale-${index}`}
              label={t("purchase.wholesalePrice")}
              type="number"
              registerProps={register(`items.${index}.wholesalePrice`, {
                valueAsNumber: true,
              })}
            />

            <button type="button" onClick={() => remove(index)}>
              <Trash2 className="text-red-500" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ product: "", quantity: 1, purchasePrice: 0 })}
          className="btn btn-sm btn-outline"
        >
          + Add Product
        </button>

        {/* Payment + Summary */}
        <div className="p-6 border rounded-xl shadow-md bg-white space-y-6">
          {/* Payment Information Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FloatingInput
              id="paid"
              label="Paid Amount"
              type="number"
              registerProps={register("paid", { valueAsNumber: true })}
            />

            <FloatingInput
              id="discount"
              label="Discount (%)"
              type="number"
              registerProps={register("discount", { valueAsNumber: true })}
            />

            <FloatingInput
              id="shippingCost"
              label="Shipping Cost"
              type="number"
              registerProps={register("shippingCost", { valueAsNumber: true })}
            />
          </div>

          {/* Status and Payment Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                {...register("status")}
                className="w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="" disabled selected>
                  Select Status
                </option>
                <option value="Received">Received</option>
                <option value="Order">Order</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                Payment Method
              </label>
              <select
                {...register("paymentMethod")}
                className="w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="" disabled selected>
                  Select Method
                </option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {due > 0 && (
              <div className="relative">
                <label className="block text-sm text-gray-600 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  {...register("dueDate", {
                    required: true,
                  })}
                  className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.dueDate
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        <div className="text-right font-bold space-y-1">
          <p>Total: ৳{total.toFixed(2)}</p>
          <p>Discount: ৳{discountAmount.toFixed(2)}</p>
          <p>Shipping: ৳{shippingCost.toFixed(2)}</p>
          <p>Grand Total: ৳{grandTotal.toFixed(2)}</p>
          <p>Paid: ৳{paid.toFixed(2)}</p>
          <p>Due: ৳{due.toFixed(2)}</p>
        </div>

        <div className="text-right">
          <button type="submit" className="btn btn-primary">
            Submit Purchase
          </button>
        </div>
      </form>

      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] shadow-lg relative"
          >
            <SupplierAddForm />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setShowSupplierModal(false)}
                className="p-1 border border-danger-500 rounded-md text-danger-500"
              >
                <X />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PurchaseForm;
