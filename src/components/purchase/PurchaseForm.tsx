import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, PlusCircle, X } from "lucide-react";
import SupplierAddForm from "../supplier/SupplierAddForm";
import FloatingInput from "./FloatingInput";
import { useTranslation } from "react-i18next";


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
}

interface PurchaseFormData {
  supplier: Supplier | null;
  items: {
    product: string;
    quantity: number;
    purchasePrice: number;
    retailPrice?: number; // নতুন
    wholesalePrice?: number; // নতুন
  }[];
  paid: number;
  paymentMethod: string;
}

const PurchaseForm = () => {
  const { register, handleSubmit, control, watch, setValue, reset } =
    useForm<PurchaseFormData>({
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
        paymentMethod: "Cash",
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const items = watch("items");
  const paid = watch("paid");
  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.purchasePrice,
    0
  );
  const due = total - paid;

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get("http://localhost:3000/product")
      .then((res) => setProducts(res.data));
    axios
      .get("http://localhost:3000/suppliers")
      .then((res) => setSuppliers(res.data.data));
  }, []);

  const onSubmit = async (data: PurchaseFormData) => {
    if (!data.supplier) {
      return Swal.fire({ icon: "error", title: "Supplier is required" });
    }

    if (due < 0) {
      return Swal.fire({
        icon: "error",
        title: "Paid amount cannot be more than total",
      });
    }

    const transformed = {
      supplier: {
        _id: data.supplier._id,
        name: data.supplier.name,
        phone: data.supplier.phone,
        email: data.supplier.email,
        address: data.supplier.address,
      },
      items: data.items.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        retailPrice: item.retailPrice,
        wholesalePrice: item.wholesalePrice,
      })),
      total,
      paid: data.paid,
      due,
      paymentMethod: data.paymentMethod,
    };

    try {
      await axios.post("http://localhost:3000/purchases/add", transformed);
      Swal.fire({ icon: "success", title: "Purchase Completed" });
      reset();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Purchase Failed" });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white"
      >
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-6">
          <ShoppingBag className="w-7 h-7" /> {t("purchase.title")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Supplier Select */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              {t("purchase.supplierLabel")}
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
                    if (selected) {
                      field.onChange(selected);
                    }
                  }}
                  options={[
                    ...suppliers.map((s) => ({ label: s.name, value: s._id })),
                    { label: "➕ New Supplier", value: "add_new" },
                  ]}
                  placeholder={t("purchase.selectSupplier")}
                  className="lg:w-[50%] w-full"
                />
              )}
            />
          </div>

          {/* Product Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {t("purchase.productItems")}
            </h3>
            <div className="space-y-3">
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-7 items-center gap-2 bg-gray-50 p-3 rounded-md shadow-sm"
                  >
                    <Controller
                      control={control}
                      name={`items.${index}.product`}
                      render={({ field }) => {
                        const selected = products.find(
                          (p) => p._id === field.value
                        );
                        return (
                          <Select
                            value={
                              selected
                                ? {
                                    label: selected.productName,
                                    value: selected._id,
                                  }
                                : null
                            }
                            onChange={(opt) => {
                              field.onChange(opt?.value);
                              const selectedProduct = products.find(
                                (p) => p._id === opt?.value
                              );
                              if (selectedProduct) {
                                setValue(
                                  `items.${index}.purchasePrice`,
                                  selectedProduct.purchasePrice
                                );
                                setValue(
                                  `items.${index}.retailPrice`,
                                  selectedProduct.retailPrice || 0
                                );
                                setValue(
                                  `items.${index}.wholesalePrice`,
                                  selectedProduct.wholesalePrice || 0
                                );
                              }
                            }}
                            options={products?.map((p) => ({
                              label: p.productName,
                              value: p._id,
                            }))}
                            placeholder={t("purchase.selectProduct")}
                            className="col-span-2"
                          />
                        );
                      }}
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

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      title={t("purchase.deleteProduct")}
                    >
                      <Trash2 className="text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() =>
                append({ product: "", quantity: 1, purchasePrice: 0 })
              }
              className="mt-3 text-blue-600 flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> {t("purchase.addProduct")}
            </button>
          </div>

          {/* Payment Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>{t("purchase.paid")}</label>
              <input
                type="number"
                {...register("paid", { valueAsNumber: true })}
                placeholder={t("purchase.paid")}
                className="border mt-1 w-full outline-none input"
              />
            </div>
            <div>
              <label>{t("purchase.paymentMethod")}</label>
              <select
                {...register("paymentMethod")}
                className="border mt-1 w-full outline-none input"
              >
                <option value="Cash">Cash</option>
                <option value="bKash">bKash</option>
                <option value="Bank">Bank</option>
              </select>
            </div>
          </div>

          {/* Total and Submit */}
          <div className="text-right mt-6 text-lg font-semibold">
            {t("purchase.total")}:{" "}
            <span className="text-green-600">৳ {total.toFixed(2)}</span>
          </div>

          <div className="text-right">
            <button type="submit" className=" text-white btn-primary">
              {t("purchase.submitButton")}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ✅ New Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
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
    </>
  );
};

export default PurchaseForm;
