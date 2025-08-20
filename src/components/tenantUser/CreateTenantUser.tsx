import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

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

  const onSubmit = async (data: UserForm) => {
    if (!token || !decodedUser?.tenantId) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/user/${decodedUser.tenantId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "User creation failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Create Tenant User
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            {...register("userName", { required: "Username is required" })}
            placeholder="Username"
            className={`border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.userName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userName.message}
            </p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className={`border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </motion.div>

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <select
            {...register("role")}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full btn-primary ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </motion.button>
      </form>
    </motion.div>
  );
}
