import React from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-12 h-12 text-indigo-500" />
      </motion.div>
    </div>
  );
};

export default Loading;
