import { Context, ReactNode, createContext, useContext, useState } from "react";
import { userLogout } from "../../Api/api";
import { UserLoginResponseInterface } from "../../Api/apiInterface";

type AuthContextType = {
  isAuthenticated: boolean;
  nickname: string;
  logUserIn: (data: UserLoginResponseInterface) => void;
  logUserOut: () => void;
};

type AuthContextPropsType = {
  children: ReactNode;
};

const AuthContext: Context<AuthContextType | null> =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthContextPropsType) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [nickname, setNickname] = useState("");

  const logUserIn = (data:UserLoginResponseInterface) => {
    setIsAuthenticated(true);
    setNickname(data.nickname);
    console.log("logUserIn");
  };

  const logUserOut = () => {
    userLogout()
      .catch(error => {
        console.log("Error during logout", error);
      });
    setIsAuthenticated(false);
    setNickname("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, nickname, logUserIn, logUserOut }}>
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