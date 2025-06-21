import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { UserInfo } from "../types";
import { useNavigate } from "react-router-dom";
import { handleRegister } from "../utils/api";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data: UserInfo) => {
    await handleRegister(data, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-[#dbeafe] to-[#e0f2fe] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-blue-100"
      >
        <h2 className="text-3xl font-bold text-center text-sky-600 mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
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
              {...register("userName", { required: "Username is required" })}
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
              <p className="text-red-500 text-xs mt-1">
                {errors.userName.message}
              </p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
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
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          {/* Confirm Password */}

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder=" "
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="peer w-full rounded-xl border border-gray-300 pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-transparent shadow-sm 
                focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-10 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                peer-placeholder-shown:text-gray-400 peer-focus:-top-2 
                peer-focus:text-xs peer-focus:text-sky-600"
            >
              Confirm Password
            </label>
            <span
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full btn-primary"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
