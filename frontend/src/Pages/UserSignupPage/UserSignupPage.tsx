import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { userLogin } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";
import { UserSignupInterface } from "../../Api/apiInterface";
import UserForm from "../../Components/UserForm/UserForm";

const UserSignupPage: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [signupData, setSignupData] = useState<UserSignupInterface>();

    const navigate = useNavigate();


    return (
        <>
        <UserForm data={undefined}/>
        </>
    )

}

export default UserSignupPage;