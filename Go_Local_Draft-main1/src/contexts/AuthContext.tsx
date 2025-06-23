import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { Users } from "../pages/AdminDashboard";

interface AuthContextType {
   user: Users | null;
  login: (username: string, password: string) => Promise<boolean>;
  logouts :() => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<Users| null>>
  register({name, phone, location, role, serviceCategory, description} : any, password: string) : Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [logout , setLogout] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("go_local_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("go_local_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    try{
    const log = await axios.post("http://localhost:8080/api/auth/login", {
      "username": username,
      "password": password
    });

    localStorage.setItem("token", log.data.accessToken);

    setLoading(false);
    return false;
  }
catch(err){
  setLoading(false);
  console.error("Login failed:", err);
  return false;
  
}
  };

  const logouts = async (): Promise<boolean> => {
    setLogout(true);
  
    try {
      // Optionally, call an actual API endpoint to log out
      await axios.post("http://localhost:8080/api/auth/logout");
  
      // Remove tokens from localStorage or cookies
      localStorage.removeItem("token");
   
  
      setLogout(true);
  
      
      
      return true;
    } catch (err) {
      setLogout(false);
      // Optionally display error
      console.error("Logout failed:", err);
      return false;
    }
  };

  const register = async({}, password: string) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      return false;
    };


  const value: AuthContextType = {
    user,
    login,
    logouts,
    register,
    isAuthenticated: !!user,
    setUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
