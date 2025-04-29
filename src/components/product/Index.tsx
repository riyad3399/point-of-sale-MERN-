import React from "react";
import { motion } from "framer-motion";
import Add from "./Add";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const Index: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full mx-auto bg-white p-8 rounded-2xl shadow-2xl max-w-4xl"
    >
      <Add/>
    </motion.div>
  );
};

export default Index;
