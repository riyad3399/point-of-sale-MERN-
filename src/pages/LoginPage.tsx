import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { User, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { UserInfo } from "../types";
import { useNavigate } from "react-router-dom";
import { handleLogin, handleProfile } from "../utils/api";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    handleProfile(token, navigate);
  }, [navigate]);

  const onSubmit = async (data: UserInfo) => {
    handleLogin(data, navigate);
  };

  return (
    <div className="min-h-screen h-full flex items-center justify-center bg-gradient-to-tr from-blue-50 to-sky-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-sky-600 mb-6">
          Login Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              id="userName"
              type="text"
              placeholder=" "
              {...register("userName", { required: true })}
              className="peer w-full rounded-xl border border-gray-300 pl-10 pr-3 py-3 text-sm text-gray-900 placeholder-transparent shadow-sm 
    focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
            />
            <label
              htmlFor="userName"
              className="absolute left-10 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 
    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
    peer-placeholder-shown:text-gray-400 peer-focus:-top-2 
    peer-focus:text-xs peer-focus:text-sky-600"
            >
              Username
            </label>
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">Username is required</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              {...register("password", { required: true, minLength: 6 })}
              className="peer w-full rounded-xl border border-gray-300 pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-transparent shadow-sm 
    focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
            />
            <label
              htmlFor="password"
              className="absolute left-10 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 
    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
    peer-placeholder-shown:text-gray-400 peer-focus:-top-2 
    peer-focus:text-xs peer-focus:text-sky-600"
            >
              Password
            </label>
            <span
              className="absolute right-3 top-[15px] text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full btn-primary py-3 transition-all"
          >
            Login
          </motion.button>

          {/* Success Message */}
          {isSubmitSuccessful && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 justify-center text-green-600 text-sm mt-2"
            >
              <CheckCircle size={18} /> Login Successful!
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
