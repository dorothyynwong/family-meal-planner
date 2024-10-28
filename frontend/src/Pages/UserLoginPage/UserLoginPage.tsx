import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { userLogin } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";

const UserLoginPage: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    const { logUserIn } = useAuth();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");
        
        userLogin(email, password)
            .then(response => {
                if (response.status === 200) {
                    logUserIn();
                    navigate(`/home`);
                    setStatus("success");
                    console.log(status);
                }
            })
            .catch(error => {
                console.log("Error login", error);
                const errorMessage = error?.response?.data?.message || "Error login";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="user-name">
                <Form.Label>Email</Form.Label>
                <Form.Control className="custom-form-control" type="email" placeholder="Enter Email" name="email" value={email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-password">
                <Form.Label>Password</Form.Label>
                <Form.Control className="custom-form-control" type="password" placeholder="Enter Password" name="password" value={password} onChange={handleChange} />
            </Form.Group>
            <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Logging In ..."
                    successMessage="Logged In Successfully!"
                >
                    <></>
            </StatusHandler>
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
            
        </Form>
    )

}

export default UserLoginPage;