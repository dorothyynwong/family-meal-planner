import { Button, Form } from "react-bootstrap"
import StatusHandler from "../StatusHandler/StatusHandler"
import { useEffect, useState } from "react";
import { UserSignupInterface } from "../../Api/apiInterface";
import { updateUser, userLogin, userSignup } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";

interface UserFormProps {
    data?: UserSignupInterface,
    mode: string
}

const UserForm: React.FC<UserFormProps> = ({ data, mode }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signupData, setSignupData] = useState<UserSignupInterface>(data ? data : {
        email: "",
        nickname: "",
        password: "",
        familycode: "",
        avatarColor: "",
        avatarUrl: "",
        avatarFgColor: "",
    });

    const {logUserIn} = useAuth();
    
    useEffect(() => {
        if (data)
            setSignupData(data);
    }, [data])

    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "confirmPassword") setConfirmPassword(value);
        else {
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

        if (signupData && signupData.password !== confirmPassword) {
            setErrorMessages([...errorMessages, "Password isn't matched"]);
        }

        if (mode == "add") {
            userSignup(signupData!)
                .then(response => {
                    if (response.status === 200) {
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
        else {
            updateUser(signupData!)
                .then(response => {
                    setSignupData(response.data);
                    if (response.status === 200) {
                        if (signupData && signupData.email && signupData.password) {
                            userLogin(signupData.email, signupData.password)
                                .then(response => {
                                    if (response.status === 200) {
                                        logUserIn(response.data);
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
                    }
                })
                .catch(error => {
                    console.log("Error updating user", error);
                    const errorMessage = error?.response?.data?.message || "Error updating user";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
                });
        }

    }

    return (
        <Form onSubmit={handleSubmit}>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Signing up / Updating user ..."
                successMessage="Signed Up / Updated Successfully!"
            ><></>
            </StatusHandler>
            {
                mode == "add" &&
                <Form.Group className="mb-3" controlId="user-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        className="custom-form-control"
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={signupData && signupData.email || ""}
                        onChange={handleChange} />
                </Form.Group>
            }

            {
                mode == "edit" &&
                <Form.Group className="mb-3" controlId="user-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        readOnly
                        className="custom-form-control"
                        type="email"
                        name="email"
                        value={signupData && signupData.email ? signupData.email : ""}
                        onChange={handleChange} />
                </Form.Group>
            }

            <Form.Group className="mb-3" controlId="user-password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    required
                    className="custom-form-control"
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    value={signupData.password || ""}
                    onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-confirm-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    required
                    className="custom-form-control"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword || ""}
                    onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-nickname">
                <Form.Label>Nickname</Form.Label>
                <Form.Control
                    required
                    className="custom-form-control"
                    type="text"
                    placeholder="Enter Nickname"
                    name="nickname"
                    value={signupData && signupData.nickname ? signupData.nickname : ""}
                    onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-avatarColor">
                <Form.Label>Avatar Color</Form.Label>
                <Form.Control
                    className="custom-form-control"
                    type="text"
                    placeholder="Enter Avatar Color"
                    name="avatarColor"
                    value={signupData && signupData.avatarColor || ""}
                    onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-avatarFgColor">
                <Form.Label>Avatar Font Color</Form.Label>
                <Form.Control
                    className="custom-form-control"
                    type="text"
                    placeholder="Enter Avatar Font Color"
                    name="avatarFgColor"
                    value={signupData && signupData.avatarFgColor || ""}
                    onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="user-avatarUrl">
                <Form.Label>Avatar Url</Form.Label>
                <Form.Control
                    className="custom-form-control"
                    type="text"
                    placeholder="Enter Avatar Url"
                    name="avatarUrl"
                    value={signupData && signupData.avatarUrl || ""}
                    onChange={handleChange} />
            </Form.Group>

            {
                mode === "add" &&
                <Form.Group className="mb-3" controlId="user-familycode">
                    <Form.Label>Family Share Code</Form.Label>
                    <Form.Control
                        className="custom-form-control"
                        type="text"
                        placeholder="Enter Family Share Code"
                        name="familycode"
                        value={signupData && signupData.familycode || ""}
                        onChange={handleChange} />
                </Form.Group>
            }


            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )
}

export default UserForm;