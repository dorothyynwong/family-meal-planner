import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateAccessToken } from "../../Api/api";
import StatusHandler from "../StatusHandler/StatusHandler";
import { useAuth } from '../AuthProvider/AuthProvider';

const PrivateRoute: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const { isAuthenticated, setIsAuthenticated } = useAuth();

    useEffect(() => {
        setStatus("loading");
        validateAccessToken()
            .then(response => {
                localStorage.setItem('isAuthenticated', JSON.stringify(response.data));
                setStatus("success");
                setErrorMessages([]);
                setIsAuthenticated(response.data);
            })
            .catch(error => {
                const errorMessage = error?.response?.data?.message || "Error validating access token";
                localStorage.setItem('isAuthenticated','false');
                setErrorMessages([...errorMessages, errorMessage]);
                setStatus("error")
            });
    }, [isAuthenticated, setIsAuthenticated])

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
        { isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </>
    );
}

export default PrivateRoute;