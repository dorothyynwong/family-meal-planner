import { Button, Form } from "react-bootstrap"
import StatusHandler from "../StatusHandler/StatusHandler"
import { useState } from "react";
import { UserSignupInterface } from "../../Api/apiInterface";
import { userSignup } from "../../Api/api";
import { useNavigate } from "react-router-dom";

interface UserFormProps {
    data?: UserSignupInterface
}

const UserForm: React.FC<UserFormProps> = ({ data }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signupData, setSignupData] = useState<UserSignupInterface>(data ? data : {
                                                                            email: "",
                                                                            nickname: "",
                                                                            password: "",
                                                                            familycode: ""
                                                                        });
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "confirmPassword") setConfirmPassword(value);
        else
        {
                setSignupData({
                    ...signupData,
                    [name]: value,
                })
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");
        setErrorMessages([]);

        if(signupData.password !== confirmPassword) {
            setErrorMessages([...errorMessages, "Password isn't matched"]);
        }

        userSignup(signupData)
        .then(response => {
            if(response.statusText==="OK")
            {
                navigate(`/`);
            }
        })
        .catch(error => {
            console.log("Error signing up", error);
            const errorMessage = error?.response?.data?.message || "Error signing up";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="user-email">
                <Form.Label>Email</Form.Label>
                <Form.Control required className="custom-form-control" type="email" placeholder="Enter Email" name="email" value={signupData.email || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-password">
                <Form.Label>Password</Form.Label>
                <Form.Control required className="custom-form-control" type="password" placeholder="Enter Password" name="password" value={signupData.password || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-confirm-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control required className="custom-form-control" type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-nickname">
                <Form.Label>Nickname</Form.Label>
                <Form.Control className="custom-form-control" type="text" placeholder="Enter Nickname" name="nickname" value={signupData.nickname || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-familycode">
                <Form.Label>Family Share Code</Form.Label>
                <Form.Control className="custom-form-control" type="text" placeholder="Enter Family Share Code" name="familycode" value={signupData.familycode || ""} onChange={handleChange} />
            </Form.Group>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Loggin In ..."
                successMessage="Logged In Successfully!"
            >
                <div className="d-flex justify-content-end">
                    <Button className="custom-button recipe-button" size="lg" type="submit">
                        Submit
                    </Button>
                </div>
            </StatusHandler>
        </Form>
    )
}

export default UserForm;