import React from "react";
import { Spinner,  Alert } from "react-bootstrap";

export interface StatusHandlerProps {
    status: "idle" | "loading" | "success" | "error";
    errorMessages?: string[];
    loadingMessage?: string;
    successMessage?: string;
    children: React.ReactNode;
}

const StatusHandler: React.FC<StatusHandlerProps> = ({
    status,
    errorMessages = [],
    loadingMessage = "Loading...",
    successMessage = "Operation successful!",
    children,
}) => {
    switch (status) {
        case "loading":
            if (loadingMessage === "") return <></>
            return (
                <div className="d-flex align-items-center">
                    <Spinner animation="border" role="status" className="me-2">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <span>{loadingMessage}</span>
                </div>
            );

        case "error":
            return (
                <>
                    {errorMessages.length > 0 && errorMessages.map((error, index) => (
                        <Alert key={index} variant="danger">
                            {error}
                        </Alert>
                    ))}
                </>
            );

        case "success":
            if (loadingMessage === "") return <></>
            return <Alert variant="success">{successMessage}</Alert>;

        case "idle":
        default:
            return <>{children}</>;
    }
};

export default StatusHandler;
