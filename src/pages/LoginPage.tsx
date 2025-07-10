import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserInfo } from "../types";
import { handleLogin } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useRegisterVisibility } from "../hooks/useRegisterVisibility";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfo>();
  const { visible: showRegister, loading } = useRegisterVisibility();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: UserInfo) => {
    setIsSubmitting(true);
    await handleLogin(data, navigate, login);
    setIsSubmitting(false);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };



  return (
    <div className="min-h-screen h-full flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Dynamic Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
        animate={{
          background: [
            "linear-gradient(45deg, #1e3a8a, #4b5e8a, #1e40af)",
            "linear-gradient(45deg, #1e40af, #1e3a8a, #4b5e8a)",
            "linear-gradient(45deg, #4b5e8a, #1e40af, #1e3a8a)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      ></motion.div>

      {/* Split-Screen Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex overflow-hidden"
      >
        {/* Left Branding Section */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary-800 to-indigo-900 py-5 px-8 text-white lg:flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <img
                src="../../photo/logo.png"
                alt="Logo"
                className="w-full h-fit"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-sm opacity-80"
            >
              Securely access your account and unlock a world of possibilities
              with SALEMATE.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xs opacity-60"
          >
            © {new Date().getFullYear()} SALEMATE. All rights reserved.
          </motion.div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-tight"
          >
            Sign In
          </motion.h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Username */}
            <motion.div
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="userName"
                type="text"
                {...register("userName", { required: true })}
                className="peer w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3 text-sm text-gray-900 placeholder-transparent bg-white/70 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Username"
                autoComplete="username"
              />
              <label
                htmlFor="userName"
                className="absolute left-12 -top-2 text-xs text-gray-500 bg-white/90 px-1 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Username
              </label>
              {errors.userName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-1"
                >
                  Username is required
                </motion.p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              custom={1}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true, minLength: 6 })}
                className="peer w-full rounded-xl border border-gray-200 pl-12 pr-12 py-3 text-sm text-gray-900 placeholder-transparent bg-white/70 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Password"
                autoComplete="current-password"
              />
              <label
                htmlFor="password"
                className="absolute left-12 -top-2 text-xs text-gray-500 bg-white/90 px-1 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Password
              </label>
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer select-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-1"
                >
                  Password must be at least 6 characters
                </motion.p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              custom={2}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              type="submit"
              disabled={isSubmitting}
              className="relative w-full btn-primary transition-all duration-300 overflow-hidden"
            >
              <AnimatePresence>
                {isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {!loading && showRegister && (
            <motion.p
              custom={3}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 text-center text-sm text-gray-600"
            >
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </Link>
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
