import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { User, Phone, MapPin } from "lucide-react";

type OptionType = {
  value: string;
  label: string;
  customerName: string;
  phone: string;
};

export default function SearchableDropdown() {
  const [customers, setCustomers] = useState<OptionType[]>([]);
  const [selectWalking, setSelectWalking] = useState<OptionType | null>(null);

  useEffect(() => {
    axios.get("http://localhost:3000/customer").then((res) => {
      const options = res.data.map((customer: any) => ({
        value: customer.customerId,
        label: `${customer.customerName} | ${customer.phone}`,
        customerName: customer.customerName.toLowerCase(),
        phone: customer.phone,
      }));

      const optionsWithWalkingCustomer = [
        {
          value: "walking",
          label: "🚶 Walking Customer",
          phone: "",
          customerName: "",
        },
        ...options,
      ];
      setCustomers(optionsWithWalkingCustomer);
    });
  }, []);

  const handleChange = (selected: OptionType | null) => {
    setSelectWalking(selected);
  };

  const customFilter = (option: { data: OptionType }, inputValue: string) => {
    const search = inputValue.toLowerCase();
    return (
      option.data.customerName.includes(search) ||
      option.data.phone.includes(search)
    );
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="w-full md:w-3/4">
          <Select
            options={customers}
            onChange={handleChange}
            isSearchable
            placeholder="🔍 Search by name or phone"
            filterOption={customFilter}
            className="text-sm"
          />
        </div>
        <input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-blue-500 shadow-sm"
        />
      </div>

      {selectWalking?.value === "walking" && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white">
            <User size={16} className="text-gray-500" />
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Customer Name"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white">
            <Phone size={16} className="text-gray-500" />
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Customer Mobile"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white">
            <MapPin size={16} className="text-gray-500" />
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Customer Address"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
