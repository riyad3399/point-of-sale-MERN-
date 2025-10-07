import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { motion } from "framer-motion";
import { Loader, Trash2, X } from "lucide-react";
import SupplierAddForm from "../supplier/SupplierAddForm";
import FloatingInput from "./FloatingInput";
import { useTranslation } from "react-i18next";

import {
  handleGetCategory,
  handleGetProduct,
  handleGetSupplier,
  handleInsertPurchase,
} from "../../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet-async";

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
    category?: string;
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
  details?: string;
}

export default function PurchaseFormPhotostyle() {
  const { t } = useTranslation();
  const { token } = useAuth();

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
          category: "",
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
    (acc, item) => acc + (item.quantity || 0) * (item.purchasePrice || 0),
    0
  );
  const discountPercent = discount || 0;
  const discountAmount = (total * discountPercent) / 100;
  const grandTotal = total - discountAmount + shippingCost;
  const due = grandTotal - paid;

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleGetProduct(setProducts, token);
    handleGetSupplier(setSuppliers);
  }, [token]);

  useEffect(() => {
    handleGetCategory({ setCategories, setLoading });
  }, []);

  const onSubmit = async (data: PurchaseFormData) => {
    // Recalculate server side values just like original
    const total = data.items.reduce(
      (acc, item) => acc + item.quantity * item.purchasePrice,
      0
    );
    const discountPercent = data.discount || 0;
    const discount = (total * discountPercent) / 100;
    const transportCost = data.shippingCost || 0;
    const grandTotal = total - discount + transportCost;
    const due = grandTotal - (data.paid || 0);

    if (!data.supplier) return toast.error("Supplier is required");
    if (!data.items.length || data.items.some((item) => !item.category))
      return toast.error(" Category is required");

    if (due < 0)
      return toast.error("Paid amount cannot be more than grand total");
    if (!data.items.length || data.items.some((item) => !item.product))
      return toast.error("At least one valid product is required");

    const transformed = {
      supplierId: data.supplier._id,
      supplierName: data.supplier.name,
      items: data.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        category: item.category,
        purchasePrice: item.purchasePrice,
        retailPrice: item.retailPrice,
        wholesalePrice: item.wholesalePrice,
      })),
      total,
      discountPercent,
      discount,
      transportCost,
      grandTotal,
      paid: data.paid,
      due,
      paymentMethod: data.paymentMethod,
      status: data.status,
      dueDate: data.dueDate,
      purchaseDate: data.purchaseDate || new Date(),
      invoiceNumber: data.invoiceNumber,
      details: data.details,
    };

    handleInsertPurchase(reset, transformed);
  };

  return (
    <div className="max-w-full ">
      <Helmet>
        <title>Add Purchase | POS System</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Top area: Supplier, Invoice, Dates, Payment Type, Details */}
        <div className="grid grid-cols-12 gap-4 items-center mb-6">
          <div className="col-span-5">
            <label className="text-sm font-medium text-gray-700">
              Supplier Name <span className="text-red-500">*</span>
            </label>
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
                    ...suppliers.map((s) => ({
                      label: s.name,
                      value: s._id,
                    })),
                    { label: "➕ Add Supplier", value: "add_new" },
                  ]}
                  placeholder="Select Option"
                  className="w-full "
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Purchase Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              {...register("purchaseDate")}
              className="mt-2 w-full input-sm  rounded-md "
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              {...register("dueDate")}
              className="mt-2 w-full input-sm  rounded-md "
            />
          </div>

          <div className="col-span-3">
            <label className="text-sm font-medium text-gray-600">
              Payment Type
            </label>
            <select
              {...register("paymentMethod")}
              className="mt-2 w-full input-sm rounded-md"
            >
              <option value="Cash">Cash Payment</option>
              <option value="Bank">Bank</option>
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* details */}
          <div className="col-span-2">
            <label className=" text-sm text-gray-600">Status</label>
            <select
              {...register("status")}
              className="mt-2 w-full input-sm  rounded-md"
            >
              <option value="Received">Received</option>
              <option value="Order">Order</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Items table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-white">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 border-b px-4 py-3">
              <div className="col-span-2">
                Item Information <span className="text-red-500">*</span>
              </div>
              <div className="col-span-2">
                Category <span className="text-red-500">*</span>
              </div>
              <div className="col-span-2 ">Stock/Quantity</div>
              <div className="col-span-2 ">Quantity</div>
              <div className="col-span-2 ">Rate</div>
              <div className="col-span-1 ">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {fields.map((field, index) => {
              const productStock = products.find(
                (p) => p.productName === items[index]?.product
              );
              const lineTotal =
                (items[index]?.quantity || 0) *
                (items[index]?.purchasePrice || 0);

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b"
                >
                  <div className="col-span-2">
                    <CreatableSelect
                      value={
                        items[index].product
                          ? {
                              label: items[index].product,
                              value: items[index].product,
                            }
                          : null
                      }
                      onChange={(opt) => {
                        setValue(`items.${index}.product`, opt?.value || "");
                        const selected = products.find(
                          (p) => p.productName === opt?.value
                        );
                        if (selected) {
                          setValue(
                            `items.${index}.purchasePrice`,
                            selected.purchasePrice || 0
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
                      onCreateOption={(inputValue) => {
                        const newProduct: Product = {
                          _id: Date.now().toString(),
                          productName: inputValue,
                          quantity: 1,
                          purchasePrice: 0,
                        };
                        setProducts((p) => [...p, newProduct]);
                        setValue(`items.${index}.product`, inputValue);
                      }}
                      options={products.map((p) => ({
                        label: p.productName,
                        value: p.productName,
                      }))}
                      placeholder="Select Option"
                    />
                  </div>
                  <div className="col-span-2">
                    <Controller
                      control={control}
                      name={`items.${index}.category` as any}
                      render={({ field: catField }) => (
                        <Select
                          value={
                            catField.value
                              ? {
                                  label: catField.value,
                                  value: catField.value,
                                }
                              : null
                          }
                          onChange={(opt) =>
                            catField.onChange(opt?.value || "")
                          }
                          options={categories.map((c) => ({
                            label: c.categoryName,
                            value: c.categoryName,
                          }))}
                          placeholder="Category"
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-2 text-center text-sm text-gray-600">
                    <div className="bg-gray-100 rounded-md px-2 py-2.5">
                      {productStock ? productStock.quantity : "0.00"}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      step="1"
                      {...register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-full input-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.purchasePrice` as const, {
                        valueAsNumber: true,
                      })}
                      className="input-sm w-full"
                    />
                  </div>

                  <div className="col-span-1 text-center">
                    <div className="bg-gray-100 rounded-md px-3 py-2">
                      {lineTotal.toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center px-3 py-1 border rounded bg-white hover:bg-red-50"
                    >
                      <Trash2 className="text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="px-4 py-4">
              <button
                type="button"
                onClick={() =>
                  append({
                    product: "",
                    quantity: 1,
                    category: "",
                    purchasePrice: 0,
                    retailPrice: 0,
                    wholesalePrice: 0,
                  })
                }
                className="btn-success btn-sm"
              >
                + Add More Item
              </button>
            </div>

            {/* Summary & Payment area */}
            <div className="px-4 py-4 grid grid-cols-12 gap-4 items-start">
              <div className="col-span-7">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <FloatingInput
                      id="discount"
                      label="Discount (%)"
                      type="number"
                      registerProps={register("discount", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div>
                    <FloatingInput
                      id="shippingCost"
                      label="Shipping Cost"
                      type="number"
                      registerProps={register("shippingCost", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div>
                    <FloatingInput
                      id="paid"
                      label="Paid Amount"
                      type="number"
                      registerProps={register("paid", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {due > 0 && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        {...register("dueDate", { required: true })}
                        className={`w-full input-sm rounded-md ${
                          errors.dueDate ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-right font-semibold">Discount:</div>
                  <div className="bg-gray-100 rounded h-10 flex items-center px-3">
                    ৳{discountAmount.toFixed(2)}
                  </div>

                  <div className="text-right font-semibold">Shipping:</div>
                  <div className="bg-gray-100 rounded h-10 flex items-center px-3">
                    ৳{shippingCost.toFixed(2)}
                  </div>

                  <div className="text-right font-semibold">Grand Total:</div>
                  <div className="bg-gray-100 rounded h-10 flex items-center px-3">
                    ৳{grandTotal.toFixed(2)}
                  </div>

                  <div className="text-right font-semibold">Paid:</div>
                  <div className="bg-gray-100 rounded h-10 flex items-center px-3">
                    ৳{paid.toFixed(2)}
                  </div>

                  <div className="text-right font-semibold">Due:</div>
                  <div className="bg-gray-100 rounded h-10 flex items-center px-3">
                    ৳{due.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="text-right">
          <button
            type="submit"
            className="btn-primary  min-w-48"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" /> Processing...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>

      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] shadow-lg relative overflow-auto"
          >
            <SupplierAddForm
              onSaved={(s: Supplier) => {
                setSuppliers((p) => [s, ...p]);
                setShowSupplierModal(false);
                setValue("supplier", s);
              }}
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setShowSupplierModal(false)}
                className="p-1 border rounded-md"
              >
                <X />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
