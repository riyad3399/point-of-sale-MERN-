import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

// ✅ Full decoded user structure
export interface DecodedUser {
  id: string;
  userName: string;
  roles: string;
  permissions?: {
    sales?: {
      trigger: boolean;
      retailSale?: PermissionCRUD;
      wholeSale?: PermissionCRUD;
      transactions?: PermissionCRUD;
      quotations?: PermissionCRUD;
    };
  };
  [key: string]: any; // fallback for extra fields
}

// ✅ Define permission structure
interface PermissionCRUD {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

// ✅ AuthContext type
interface AuthContextType {
  user: DecodedUser | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

// ✅ Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedUser>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode<DecodedUser>(token);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid login token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook to access context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: () => {},
      logout: () => {},
      loading: true,
    };
  }
  return context;
}
