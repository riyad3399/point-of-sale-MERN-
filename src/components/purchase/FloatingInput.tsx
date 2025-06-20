import { motion } from "framer-motion";
import { InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  registerProps?: any;
  className?: string;
}

const FloatingInput = ({
  id,
  label,
  type = "text",
  registerProps,
  className,
  ...rest
}: FloatingInputProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        id={id}
        type={type}
        {...registerProps}
        {...rest}
        placeholder=" "
        className="peer w-full rounded-md border border-gray-300 px-3 py-2.5 text-xs text-gray-900 placeholder-transparent shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <label
        htmlFor={id}
        className="absolute left-2.5 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs 
        peer-placeholder-shown:text-gray-400 peer-focus:-top-2 
        peer-focus:text-xs peer-focus:text-blue-600 "
      >
        {label}
      </label>
    </motion.div>
  );
};

export default FloatingInput;
