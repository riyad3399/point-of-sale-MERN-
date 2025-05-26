import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Store,
  Receipt,
  CreditCard,
  Users,
  BellRing,
} from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

type FormValues = {
  storeName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  taxRate: number;
  currency: string;
  logo: FileList;
};

const SettingsPage: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [hasStoreData, setHasStoreData] = React.useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key === "logo" && data.logo?.[0]) {
          formData.append("logo", data.logo[0]);
        } else {
          formData.append(key, (data as any)[key]);
        }
      }

      if (!data.logo?.[0] && logoPreview) {
        formData.append("logoUrl", logoPreview); // fallback old preview
      }

      const url = "http://localhost:3000/setting";
      const method = hasStoreData ? "patch" : "post";

      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "সেভ সফল হয়েছে!",
        text: hasStoreData
          ? "Store settings সফলভাবে আপডেট হয়েছে।"
          : "Store settings সফলভাবে তৈরি হয়েছে।",
        confirmButtonColor: "#16a34a",
      });

      setHasStoreData(true);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "সেভ ব্যর্থ!",
        text: error?.response?.data?.message || "Store settings সেভ করা যায়নি।",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:3000/setting");
        const storeData = res.data?.data;
        if (storeData) {
          setHasStoreData(true);
          reset(storeData);

          // ঠিক এইখানে logoUrl কে পুরো URL বানিয়ে preview করাও
          if (storeData.logoUrl) {
            setLogoPreview(`http://localhost:3000/${storeData.logoUrl}`);
          }
        }
      } catch (err) {
        setHasStoreData(false);
      }
    };

    fetchSettings();
  }, [reset]);
  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <div className="p-3">
              <SettingNavItem
                icon={<Store />}
                title="Store Information"
                isActive
              />
              <SettingNavItem icon={<Receipt />} title="Receipt Settings" />
              <SettingNavItem icon={<CreditCard />} title="Payment Methods" />
              <SettingNavItem icon={<Users />} title="User Management" />
              <SettingNavItem icon={<BellRing />} title="Notifications" />
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Store Information</h2>
            <p className="text-gray-600 mb-6">
              Manage your store details and business information
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="storeName"
                    label="Store Name"
                    register={register}
                  />
                  <InputField
                    id="phone"
                    label="Phone Number"
                    register={register}
                    type="number"
                  />
                </div>

                <InputField id="address" label="Address" register={register} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField id="city" label="City" register={register} />
                  <InputField id="state" label="State" register={register} />
                  <InputField id="zip" label="ZIP Code" register={register} />
                </div>

                <InputField
                  id="email"
                  label="Business Email"
                  register={register}
                  type="email"
                />

                <InputField
                  id="taxRate"
                  label="Tax Rate (%)"
                  register={register}
                  type="number"
                  disabled
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select {...register("currency")} className="input">
                    <option value="BDT">BDT - Bangla TK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="h-20 w-20 rounded-md object-contain border"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center">
                        <Store className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      {...register("logo")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const previewURL = URL.createObjectURL(file);
                          setLogoPreview(previewURL);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 300x100px. Max file size: 1MB.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <motion.button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable input component
const InputField = ({
  id,
  label,
  register,
  type = "text",
  disabled = false,
}: {
  id: keyof FormValues;
  label: string;
  register: ReturnType<typeof useForm<FormValues>>["register"];
  type?: string;
  disabled?: boolean;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      className="input"
      disabled={disabled}
    />
  </div>
);

interface SettingNavItemProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

const SettingNavItem: React.FC<SettingNavItemProps> = ({
  icon,
  title,
  isActive,
}) => {
  return (
    <motion.div
      className={`flex items-center gap-3 p-3 rounded-md mb-1 cursor-pointer ${
        isActive
          ? "bg-primary-50 text-primary-700"
          : "text-gray-700 hover:bg-gray-50"
      }`}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </motion.div>
  );
};

export default SettingsPage;
