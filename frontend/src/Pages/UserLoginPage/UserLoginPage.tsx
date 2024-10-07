import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { userLogin } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";

const UserLoginPage: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "username":
                setUsername(value);
                break;
            case "password":
                setPassword(value);
                break;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");

        userLogin(username, password)
            .then(response => {
                if (response.statusText === "OK") {
                    // const recipeData = response.data;
                    navigate(`/recipes-list/1`);
                    setStatus("success");
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
                <Form.Label>Username</Form.Label>
                <Form.Control className="custom-form-control" type="text" placeholder="Enter Username" name="username" value={username} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-password">
                <Form.Label>Password</Form.Label>
                <Form.Control className="custom-form-control" type="password" placeholder="Enter Password" name="password" value={password} onChange={handleChange} />
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

export default UserLoginPage;