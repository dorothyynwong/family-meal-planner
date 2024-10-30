import { Context, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { userLogout, validateAccessToken } from "../../Api/api";
import { UserLoginResponseInterface } from "../../Api/apiInterface";
import StatusHandler from "../StatusHandler/StatusHandler";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const logUserIn = (data: UserLoginResponseInterface) => {
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

  useEffect(() => {
    setStatus("loading");
    validateAccessToken()
      .then(response => {
        setIsAuthenticated(response.data);
        console.log(`Response Data AuthProvider: ${response.data}`);
        console.log(isAuthenticated);
        setStatus("success");
      })
      .catch(error => {
        const errorMessage = error?.response?.data?.message || "Error validating access token";
        setErrorMessages([...errorMessages, errorMessage]);
        setStatus("error")
      });
  }, [])

  return (
    <>
      <StatusHandler
        status={status}
        errorMessages={errorMessages}
        loadingMessage="Validating ..."
        successMessage=""
      >
        <></>
      </StatusHandler>

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