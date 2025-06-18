import { useEffect, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { User, Phone, MapPin } from "lucide-react";

type OptionType = {
  value: string;
  label: string;
  customerName: string;
  phone: string;
  address?: string;
};

export default function SearchableDropdown({
  selectWalking,
  setSelectWalking,
  customers,
  setAddedCustomer,
}) {
  const [walkingName, setWalkingName] = useState<string>("");
  const [walkingPhone, setWalkingPhone] = useState<string>("");
  const [walkingAddress, setWalkingAddress] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  const handleChange = (selected: OptionType | null) => {
    setAddedCustomer(selected);
    setSelectWalking(selected);
    if (selected?.value !== "walking") {
      // Clear walking input fields if not walking customer
      setWalkingName("");
      setWalkingPhone("");
      setWalkingAddress("");
    }
  };

  const customFilter = (option: { data: OptionType }, inputValue: string) => {
    const search = inputValue.toLowerCase();
    return (
      option.data.customerName.toLowerCase().includes(search) ||
      option.data.phone.includes(search)
    );
  };

  // Update parent state when walking input changes
  useEffect(() => {
    if (selectWalking?.value === "walking" && walkingName && walkingPhone) {
      setSelectWalking({
        value: "walking",
        label: "Walking Customer",
        customerName: walkingName,
        phone: walkingPhone,
        address: walkingAddress,
      });
    }
  }, [walkingName, walkingPhone, walkingAddress]);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  return (
    <motion.div
      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 shadow-inner"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="w-full md:w-3/4 lg:w-3/6">
          <Select
            required
            options={customers}
            onChange={handleChange}
            value={selectWalking}
            isSearchable
            placeholder="🔍 Search Customer by name or phone"
            filterOption={customFilter}
            className="text-sm"
          />
        </div>
        <input
          type="date"
          value={formattedDate}
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
              value={walkingName}
              onChange={(e) => setWalkingName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white">
              <Phone size={16} className="text-gray-500" />
              <input
                type="text"
                className="w-full text-sm outline-none"
                placeholder="Customer Mobile"
                value={walkingPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  setWalkingPhone(value);
                  if (value === "") {
                    setPhoneError("Phone is required");
                  } else if (!/^01[3-9]\d{8}$/.test(value)) {
                    setPhoneError("Invalid Bangladeshi phone number");
                  } else {
                    setPhoneError("");
                  }
                }}
              />
            </div>
            {phoneError && (
              <p className="absolute -bottom-5 text-xs text-red-500 px-1">
                {phoneError}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white">
            <MapPin size={16} className="text-gray-500" />
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Customer Address"
              value={walkingAddress}
              onChange={(e) => setWalkingAddress(e.target.value)}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
