import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {jwtDecode} from "jwt-decode";

export interface DecodedUser {
  id: string;
  userName: string;
  roles: string | string[];
  permissions?: Record<string, any>;
  [key: string]: any;
}

interface AuthContextType {
  user: any | null; // পুরো backend থেকে আসা user object
  decodedUser: DecodedUser | null; // token decode করে পাওয়া data
  token: string | null;
  refreshToken: string | null;
  login: (token: string, refreshToken: string, user: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [decodedUser, setDecodedUser] = useState<DecodedUser | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      try {
        const decoded = jwtDecode<DecodedUser>(savedToken);
        setDecodedUser(decoded);
        setToken(savedToken);
        setRefreshToken(savedRefreshToken);
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
        setDecodedUser(null);
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, user: any) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      const decoded = jwtDecode<DecodedUser>(token);
      setDecodedUser(decoded);
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);
    } catch (error) {
      console.error("Invalid login token:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    setDecodedUser(null);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        decodedUser,
        token,
        refreshToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
