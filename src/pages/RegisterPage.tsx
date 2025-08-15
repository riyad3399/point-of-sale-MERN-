import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../utils/api";
import { toast } from "react-hot-toast";
import { InputField } from "../components/helper/InputField";
import { PasswordField } from "../components/helper/PasswordField";

type RegisterForm = {
  userName: string;
  password: string;
  confirmPassword: string;
  tenantId?: string;
  tenantName?: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    // Validation for tenantId / tenantName
    if (!data.tenantId && !data.tenantName) {
      toast.error("Please provide either Tenant ID or Tenant Name");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleRegister(data, navigate);
    } catch {
      // handleRegister will show toast itself
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen h-full flex items-center justify-center bg-gray-100 overflow-hidden">
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex overflow-hidden"
      >
        {/* Left Branding */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary-800 to-indigo-900 py-5 px-8 text-white lg:flex flex-col justify-between">
          <div>
            <motion.img
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              src="../../photo/logo.png"
              alt="Logo"
              className="h-fit w-full"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-sm opacity-80"
            >
              Create an account to unlock a world of possibilities with
              SALEMATE.
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

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-tight"
          >
            Create Account
          </motion.h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Username */}
            <InputField
              icon={<User size={20} />}
              name="userName"
              label="Username"
              register={register}
              errors={errors}
              rules={{ required: "Username is required" }}
            />

            {/* Password */}
            <PasswordField
              name="password"
              label="Password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              register={register}
              errors={errors}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
            />

            {/* Confirm Password */}
            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              show={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
              register={register}
              errors={errors}
              rules={{
                required: "Please confirm your password",
                validate: (value: string) =>
                  value === password || "Passwords do not match",
              }}
            />

            {/* Tenant Name */}
            <InputField
              icon={<Building2 size={20} />}
              name="tenantName"
              label="Tenant Name"
              register={register}
              errors={errors}
            />

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full btn-primary transition-all duration-300 overflow-hidden ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                "Register"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}



