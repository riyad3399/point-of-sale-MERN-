import { LogOut } from "lucide-react";
import { useHandleLogout } from "../utils/api";
import { motion } from "framer-motion";

const LogoutButton = () => {
  const handleLogout = useHandleLogout();

  return (
    <motion.button
      onClick={handleLogout}
      className="group  flex items-center gap-2 px-3 py-2  text-primary-600  transition-all duration-200  w-full"
    >
      <LogOut
        size={18}
        className="transition-transform duration-300 group-hover:-rotate-90"
      />
      <span className="font-medium tracking-wide">Logout</span>
    </motion.button>
  );
};

export default LogoutButton;
