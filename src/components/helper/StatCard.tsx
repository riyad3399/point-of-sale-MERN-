import React from "react";
import { motion } from "framer-motion";
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "indigo" | "blue" | "green" | "red";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorVariants = {
    indigo: "bg-indigo-100 text-indigo-500",
    blue: "bg-blue-100 text-blue-500",
    green: "bg-green-100 text-green-500",
    red: "bg-red-100 text-red-500",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex justify-between items-center"
    >
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${colorVariants[color]}`}>
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-6 h-6",
        })}
      </div>
    </motion.div>
  );
};

export default StatCard;