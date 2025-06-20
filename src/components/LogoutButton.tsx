import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/api";

const LogoutButton = () => {
  const navigate = useNavigate();


  return (
    <button
      onClick={() => handleLogout(navigate)}
      className="ml-3 flex items-center gap-1 hover:text-red-500"
    >
      Logout <LogOut size={18}/>
    </button>
  );
};

export default LogoutButton;
