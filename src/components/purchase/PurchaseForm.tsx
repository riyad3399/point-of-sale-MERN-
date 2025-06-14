import { useForm, useFieldArray, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Hash,
  DollarSign,
  Trash2,
  PlusCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
}

interface PurchaseFormData {
  supplier: string;
  items: {
    product: string; // will be productId
    quantity: number;
    purchasePrice: number;
  }[];
  paid: number;
  paymentMethod: string;
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: "0.5rem",
    borderColor: "#d1d5db",
    padding: "2px",
    minHeight: "40px",
    boxShadow: "none",
    "&:hover": { borderColor: "#3b82f6" },
  }),
};

const PurchaseForm = () => {
  const { register, handleSubmit, control, watch, setValue } =
    useForm<PurchaseFormData>({
      defaultValues: {
        items: [{ product: "", quantity: 1, purchasePrice: 0 }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.purchasePrice,
    0
  );

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/product").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const onSubmit = async (data: PurchaseFormData) => {
    const transformedData = {
      supplier: data.supplier,
      items: data.items.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
      })),
      total,
      paid: data.paid,
      paymentMethod: data.paymentMethod,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/purchases/add",
        transformedData
      );

      Swal.fire({
        icon: "success",
        title: "Purchase Successful!",
        text: "আপনার ক্রয় সফল হয়েছে।",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Purchase Failed!",
        text: "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto bg-white"
    >
      <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-6">
        <ShoppingBag className="w-7 h-7" /> Purchase Entry
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Supplier */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Supplier Name
          </label>
          <input
            {...register("supplier", { required: true })}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-blue-500 shadow-sm text-gray-800"
            placeholder="e.g. ABC Traders"
          />
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Product Items
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
                  className="grid grid-cols-5 items-center gap-3 bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition"
                >
                  {/* Product Dropdown */}
                  <Controller
                    control={control}
                    name={`items.${index}.product`}
                    render={({ field }) => {
                      const selectedProduct = products.find(
                        (p) => p._id === field.value
                      );

                      return (
                        <Select
                          value={
                            selectedProduct
                              ? {
                                  label: selectedProduct.productName,
                                  value: selectedProduct._id,
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value);

                            const selected = products.find(
                              (p) => p._id === selectedOption?.value
                            );
                            if (selected) {
                              setValue(
                                `items.${index}.purchasePrice`,
                                selected.purchasePrice
                              );
                            }
                          }}
                          options={products.map((p) => ({
                            label: p.productName,
                            value: p._id,
                          }))}
                          placeholder="Select product"
                          styles={customStyles}
                          className="col-span-2"
                          isSearchable
                        />
                      );
                    }}
                  />

                  {/* Quantity */}
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Quantity"
                      className="w-full border px-2 py-2 rounded-md focus:outline-blue-500"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      {...register(`items.${index}.purchasePrice`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Price"
                      className="w-full border px-2 py-2 rounded-md focus:outline-blue-500"
                    />
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
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
            className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <PlusCircle className="w-5 h-5" /> Add Product
          </button>
        </div>

        {/* Payment Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Paid Amount
            </label>
            <input
              type="number"
              {...register("paid", { valueAsNumber: true })}
              placeholder="e.g. 500"
              className="border px-4 py-2 w-full rounded-md shadow-sm focus:outline-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              {...register("paymentMethod")}
              className="border px-4 py-2 w-full rounded-md shadow-sm focus:outline-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="bKash">bKash</option>
              <option value="Bank">Bank</option>
              <option value="Nagad">Nagad</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Total Display */}
        <div className="text-right text-lg font-semibold mt-6">
          Total Amount:{" "}
          <span className="text-green-600">৳ {total.toFixed(2)}</span>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="btn-primary text-white px-6 py-2 rounded-md shadow-md transition font-semibold"
          >
            Submit Purchase
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PurchaseForm;
