import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { UserInfo } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const onSubmit = async (data: UserInfo) => {
    // console.log(data);
    await axios
      .post("http://localhost:3000/user/register", data)
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => {
        navigate("/register");
      });
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-sky-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-sky-600 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <User
              className="absolute left-3 top-[15px] text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder=" "
              {...register("userName", { required: true })}
              className="w-full pl-10 pt-4 pb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 peer"
            />
            <label
              htmlFor="userName"
              className="absolute left-10 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-sky-500"
            >
              Name
            </label>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">Name is required</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-[15px] text-gray-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true, minLength: 6 })}
              className="w-full pl-10 pr-10 pt-4 pb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 peer"
            />
            <label
              htmlFor="password"
              className="absolute left-10 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-sky-500"
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
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-[15px] text-gray-400"
              size={20}
            />
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              placeholder=" "
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full pl-10 pr-10 pt-4 pb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 peer"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-10 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-sky-500"
            >
              Confirm Password
            </label>
            <span
              className="absolute right-3 top-[15px] text-gray-400 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full btn-primary py-3 transition-all"
          >
            Register
          </motion.button>

          {/* Success Message */}
          {isSubmitSuccessful && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 justify-center text-green-600 text-sm mt-2"
            >
              <CheckCircle size={18} /> Registration Successful!
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
