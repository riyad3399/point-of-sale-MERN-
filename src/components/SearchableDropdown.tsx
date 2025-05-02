import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

type OptionType = {
  value: string;
  label: string;
  customerName: string;
  phone: string;
};

export default function SearchableDropdown() {
  const [customers, setCustomers] = useState<OptionType[]>([]);
  const [selectWalking, setSelectWalking] = useState({});

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
          label: "Walking customer",
          phone: "",
          customerName: "",
        },
        ...options,
      ];
      setCustomers(optionsWithWalkingCustomer);
    });
  }, []);

  const handleChange = (selected: OptionType | null) => {
    console.log("Selected:", selected);
    setSelectWalking(selected);
  };

  // 🔍 Custom filter: Match by name or phone
  const customFilter = (option: { data: OptionType }, inputValue: string) => {
    const search = inputValue.toLowerCase();
    return (
      option.data.customerName.includes(search) ||
      option.data.phone.includes(search)
    );
  };

  return (
    <div>
      <div className="w-full flex justify-between">
        <div className="w-[70%]">
          <Select
            options={customers}
            onChange={handleChange}
            isSearchable
            placeholder="Search by name or phone"
            filterOption={customFilter}
          />
        </div>
        <div className="">
          <input type="date" name="" id="" />
        </div>
      </div>
      {selectWalking?.value === "walking" ? (
        <div className="flex justify-between mt-5">
          <input
            type="text"
            className=" h-10 w-[30%] px-3 border-b-2 border-gray-300 text-gray-900  focus:outline-none focus:border-blue-500 transition duration-300"
            placeholder="Customer Name"
          />
          <input
            type="text"
            className=" h-10 w-[30%] px-3 border-b-2 border-gray-300 text-gray-900  focus:outline-none focus:border-blue-500 transition duration-300"
            placeholder="Customer Mobile"
          />
          <input
            type="text"
            className=" h-10 w-[30%] px-3 border-b-2 border-gray-300 text-gray-900  focus:outline-none focus:border-blue-500 transition duration-300"
            placeholder="Customer Address"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
