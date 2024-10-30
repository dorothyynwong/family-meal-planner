import { Context, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { userLogout } from "../../Api/api";
import { UserLoginResponseInterface } from "../../Api/apiInterface";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (newStatus: boolean) => void;
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
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('isAuthenticated') || 'false')
  );

  const [nickname, setNickname] = useState("");

  const logUserIn = (data: UserLoginResponseInterface) => {
    setIsAuthenticated(true);
    setNickname(data.nickname);
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    localStorage.setItem('nickname', data.nickname);
    console.log("logUserIn");
  };

  const logUserOut = () => {
    userLogout()
      .catch(error => {
        console.log("Error during logout", error);
      });
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', JSON.stringify(false));
    localStorage.setItem('nickname', '');
    setNickname("");
  };

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
    setIsAuthenticated(storedAuth);
    setNickname(localStorage.getItem('nickname') || '');
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, nickname, logUserIn, logUserOut }}>
        {children}
      </AuthContext.Provider>
    </>
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