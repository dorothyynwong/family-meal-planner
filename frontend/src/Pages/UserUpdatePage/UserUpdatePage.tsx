import { useEffect, useState } from "react";
import UserForm from "../../Components/UserForm/UserForm";
import { UserSignupInterface } from "../../Api/apiInterface";
import { getUser } from "../../Api/api";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";

const UserUpdatePage: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [userData, setUserData] = useState<UserSignupInterface>({});

    useEffect(() => {
        setStatus("loading");
        getUser()
            .then(response => {
                setUserData(response.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error login", error);
                const errorMessage = error?.response?.data?.message || "Error getting user details";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }, []);

    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Getting user details..."
                successMessage=""
            >
                <></>
            </StatusHandler>
            <UserForm data={userData} mode="edit" />
        </>
    )
}

export default UserUpdatePage;