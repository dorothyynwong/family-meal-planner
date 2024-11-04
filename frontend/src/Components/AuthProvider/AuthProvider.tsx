import { Context, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { userLogout } from "../../Api/api";
import { UserLoginResponseInterface } from "../../Api/apiInterface";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (newStatus: boolean) => void;
  nickname: string;
  setNickname: (newNickname: string) => void;
  avatarColor: string;
  setAvatarColor: (newColor: string) => void;
  avatarUrl: string;
  setAvatarUrl: (newUrl: string) => void;
  avatarFgColor: string;
  setAvatarFgColor: (newColor: string) => void;
  logUserIn: (data: UserLoginResponseInterface) => void;
  logUserOut: () => void;
};

type AuthContextPropsType = {
  children: ReactNode;
};

const AuthContext: Context<AuthContextType | null> =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthContextPropsType) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('isAuthenticated') || 'false')
  );

  const [nickname, setNickname] = useState("");
  const [avatarColor, setAvatarColor] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFgColor, setAvatarFgColor] = useState("");

  const logUserIn = (data: UserLoginResponseInterface) => {
    setIsAuthenticated(true);
    setNickname(data.nickname);
    setAvatarColor(data.avatarColor);
    setAvatarUrl(data.avatarUrl);
    setAvatarFgColor(data.avatarFgColor);
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    localStorage.setItem('nickname', data.nickname);
    localStorage.setItem('avatarColor', data.avatarColor);
    localStorage.setItem('avatarUrl', data.avatarUrl);
    localStorage.setItem('avatarFgColor', data.avatarFgColor);
  };

  const logUserOut = () => {
    userLogout()
      .catch(error => {
        console.log("Error during logout", error);
      });
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', JSON.stringify(false));
    localStorage.setItem('nickname', '');
    localStorage.setItem('avatarColor', '');
    localStorage.setItem('avatarUrl', '');
    localStorage.setItem('avatarFgColor', '');
    setNickname("");
    setAvatarColor("");
    setAvatarUrl("");
    setAvatarFgColor("");
  };

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
    setIsAuthenticated(storedAuth);
    setNickname(localStorage.getItem('nickname') || '');
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isAuthenticated, 
                                      setIsAuthenticated, 
                                      nickname, 
                                      setNickname,
                                      avatarColor, 
                                      setAvatarColor, 
                                      avatarUrl, 
                                      setAvatarUrl, 
                                      avatarFgColor,
                                      setAvatarFgColor,
                                      logUserIn, 
                                      logUserOut }}>
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