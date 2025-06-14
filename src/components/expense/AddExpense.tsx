import { useForm, useFieldArray, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, PlusCircle, Trash2, X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const defaultItem = {
  category: null,
  remarks: "",
  unitPrice: 0,
  quantity: 1,
};

const categories = [
  { label: "Food", value: "Food" },
  { label: "Transport", value: "Transport" },
  { label: "Mobile Bill", value: "Mobile Bill" },
];

export default function AddExpense() {
  const { control, register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      method: "CASH",
      items: [defaultItem],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: any) => {

    const cleanedItems = data.items.map((item: any) => ({
      ...item,
      category: item.category?.value || "",
      unitPrice: Number(item.unitPrice),
      quantity: Number(item.quantity),
    }));

    const payload = {
      ...data,
      totalAmount: grandTotal,
      items: cleanedItems,
    };
    
    try {
      const response = await axios.post(
        "http://localhost:3000/expenses",
        payload
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: `${response.data?.message || "Expense Added"}`,
          confirmButtonColor: "#3085d6",
        });

        reset({
          date: new Date().toISOString().split("T")[0],
          method: "CASH",
          items: [defaultItem],
        });
      }
     
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to submit expense. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const calculateTotal = (unitPrice: number, quantity: number) => {
    return Number(unitPrice) * Number(quantity);
  };

  const grandTotal = watch("items")?.reduce(
    (sum: number, item: any) =>
      sum + calculateTotal(item.unitPrice, item.quantity),
    0
  );

  return (
    <motion.form
      layout
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto bg-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full  rounded-md p-2 ring-1 ring-blue-500 focus:ring-2 outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Payment Method
          </label>
          <select
            {...register("method")}
            className="w-full  rounded-md p-2.5 ring-1 ring-blue-500 focus:ring-2 outline-none"
          >
            <option value="CASH">Cash</option>
            <option value="BKASH">Bkash</option>
            <option value="BANK">Bank</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto lg:h-56">
        <table className="w-full text-sm text-left border rounded-2xl overflow-y-auto h-fit">
          <thead className="bg-red-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-center">#</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Remarks</th>
              <th className="px-3 py-2 text-center">Unit Price</th>
              <th className="px-3 py-2 text-center">Quantity</th>
              <th className="px-3 py-2 text-center">Total</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="">
            <AnimatePresence>
              {fields.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-3 py-2 text-center font-semibold text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2">
                    <Controller
                      name={`items.${index}.category`}
                      control={control}
                      render={({ field }) => (
                        <CreatableSelect
                          {...field}
                          options={categories}
                          placeholder="Select or type"
                          classNamePrefix="react-select"
                          isClearable
                        />
                      )}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      {...register(`items.${index}.remarks`)}
                      placeholder="Optional note"
                      className="w-full border rounded-md p-2 ring-1 ring-blue-500 focus:ring-2 outline-none "
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      {...register(`items.${index}.unitPrice`)}
                      className="w-20 border rounded-md p-1 text-right ring-1 ring-blue-500 focus:ring-2 outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                      className="w-16 border rounded-md p-1 text-right ring-1 ring-blue-500 focus:ring-2 outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 text-center font-semibold">
                    ৳
                    {calculateTotal(
                      watch(`items.${index}.unitPrice`),
                      watch(`items.${index}.quantity`)
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={() => append(defaultItem)}
          className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium"
        >
          <PlusCircle className="w-5 h-5" /> Add Item
        </button>

        <div className="text-xl font-semibold">
          Total: <span className="text-red-600">৳ {grandTotal}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-4 btn-primary text-white font-bold py-3 rounded-2xl shadow-lg transition-all"
      >
        Submit Expense
      </button>
    </motion.form>
  );
}
