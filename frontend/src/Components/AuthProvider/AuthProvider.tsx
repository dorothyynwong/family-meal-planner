import { Context, ReactNode, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  isAuthenticated: boolean;
  logUserIn: () => void;
  logUserOut: () => void;
};

type AuthContextPropsType = {
  children: ReactNode;
};

const AuthContext: Context<AuthContextType | null> =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthContextPropsType) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const logUserIn = () => {
    setIsAuthenticated(true);

  };

  const logUserOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logUserIn, logUserOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Make sure you are rendering AuthProvider at the top level of your application."
    );
  }

  return context;
};