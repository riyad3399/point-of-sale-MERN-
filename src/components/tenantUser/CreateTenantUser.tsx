import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Loader, User, Lock } from "lucide-react";

type UserForm = {
  userName: string;
  password: string;
  role: string;
};

export default function CreateTenantUser() {
  const { token, decodedUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>();

  const onSubmit = async (formData: UserForm) => {
    if (!token || !decodedUser?.tenantId) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    const dataToSend = { ...formData, tenantId: decodedUser.tenantId };

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/create-tenant-user",
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message || "Tenant user created successfully!");
      reset({ role: "staff" });
    } catch (err: any) {
      console.error("Tenant user creation error:", err);
      toast.error(err.response?.data?.message || "User creation failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Create Tenant User
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Add a new user for your tenant with role & permissions.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              {...register("userName", { required: "Username is required" })}
              placeholder="Enter username"
              className={`pl-10 pr-3 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                errors.userName ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.userName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.userName.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter password"
              className={`pl-10 pr-3 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            {...register("role")}
            className="mt-1 border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-white ${
            isSubmitting
              ? "bg-primary-400 cursor-not-allowed opacity-70"
              : "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              Creating...
            </>
          ) : (
            "Create User"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
