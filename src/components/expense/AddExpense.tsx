import { useForm, useFieldArray, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

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
  const { control, register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      method: "CASH",
      items: [defaultItem],
    },
  });
  const { t } = useTranslation();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;


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
        `${BASE_URL}/expenses`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success("Expense added successfully");

        reset({
          date: new Date().toISOString().split("T")[0],
          method: "CASH",
          items: [defaultItem],
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
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
          <label className="block text-gray-700 font-semibold mb-2">
            {t("expense.date")}
          </label>
          <input
            type="date"
            {...register("date")}
            className="w-full  rounded-md p-2 ring-1 ring-primary-500 focus:ring-2 outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            {t("expense.paymentMethod")}
          </label>
          <select
            {...register("method")}
            className="w-full  rounded-md p-2.5 ring-1 ring-primary-500 focus:ring-2 outline-none"
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
              <th className="px-3 py-2">{t("expense.category")}</th>
              <th className="px-3 py-2">{t("expense.remarks")}</th>
              <th className="px-3 py-2 text-center">
                {t("expense.unitPrice")}
              </th>
              <th className="px-3 py-2 text-center">{t("expense.quantity")}</th>
              <th className="px-3 py-2 text-center">{t("expense.total")}</th>
              <th className="px-3 py-2 text-center">{t("expense.action")}</th>
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
                  <td className="px-3 py-2 ">
                    <Controller
                      name={`items.${index}.category`}
                      control={control}
                      render={({ field }) => (
                        <CreatableSelect
                          {...field}
                          options={categories}
                          placeholder={t("expense.selectOrType")}
                          classNamePrefix="react-select"
                          isClearable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderColor: state.isFocused
                                ? "#4171b4"
                                : base.borderColor, 
                              boxShadow: state.isFocused
                                ? "0 0 0 1px #4171b4"
                                : base.boxShadow, 
                              "&:hover": {
                                borderColor: "#4171b4",
                              },
                            }),
                          }}
                        />
                      )}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      {...register(`items.${index}.remarks`)}
                      placeholder={t("expense.optionalNote")}
                      className="w-full border rounded-md p-2 ring-1 ring-primary-500 focus:ring-2 outline-none "
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      {...register(`items.${index}.unitPrice`)}
                      className="w-20 border rounded-md p-1 text-right ring-1 ring-primary-500 focus:ring-2 outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                      className="w-16 border rounded-md p-1 text-right ring-1 ring-primary-500 focus:ring-2 outline-none"
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
          className="mt-3 flex items-center gap-2 text-primary-600 hover:text-primary-800 transition font-medium"
        >
          <PlusCircle className="w-5 h-5" /> {t("expense.addItem")}
        </button>

        <div className="text-xl font-semibold">
          Total: <span className="text-red-600">৳ {grandTotal}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-4 btn-primary text-white font-bold py-3 rounded-2xl shadow-lg transition-all"
      >
        {t("expense.submitExpense")}
      </button>
    </motion.form>
  );
}
