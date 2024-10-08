import { Context, ReactNode, createContext, useContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  logUserIn: () => void;
};

type AuthContextPropsType = {
  children: ReactNode;
};

const AuthContext: Context<AuthContextType | null> =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthContextPropsType) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const logUserIn = () => {
    // For the example I just set a prop. But you'll need to do more here
    setIsAuthenticated(true);
    // Redirect to homepage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logUserIn }}>
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