import { Button, Form, InputGroup } from "react-bootstrap";
import "./Families.scss";
import React, { useState } from "react";
import Popup from "../../Components/Popup/Popup";
import { useNavigate } from "react-router-dom";
import { addFamily, addFamilyUser } from "../../Api/api";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";

const Families: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const navigate = useNavigate();
    const [familyCode, setFamilyCode] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [modalCreateFamilyShow, setModalCreateFamilyShow] = useState(false);
    const [modalJoinFamilyShow, setModalJoinFamilyShow] = useState(false);

    const handleClick = (event: { currentTarget: { id: string } }) => {
        const buttonId = event.currentTarget.id;
        switch (buttonId) {
            case "show-family-button":
                navigate(`/my-families`);
                break
            case "create-family-button":
                setStatus("loading");
                setErrorMessages([]);
                addFamily({ familyName: familyName })
                    .catch(error => {
                        console.log("Error adding family", error);
                        const errorMessage = error?.response?.data?.message || "Error adding family";
                        setStatus("error");
                        setErrorMessages([...errorMessages, errorMessage]);
                    });
                setStatus("success");
                navigate(`/my-families`);
                break;
            case "join-family-button":
                setStatus("loading");
                setErrorMessages([]);
                addFamilyUser({ familyShareCode: familyCode })
                    .catch(error => {
                        console.log("Error joining family", error);
                        const errorMessage = error?.response?.data?.message || "Error joining family";
                        setStatus("error");
                        setErrorMessages([...errorMessages, errorMessage]);
                    });
                setStatus("success");
                navigate(`/my-families`);
                break
            default:
                break
        }
    }

    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Adding/Updating family ..."
                successMessage=""
            >
                <></>
            </StatusHandler>
            <h1>My Families</h1>
            <div className="button-box">
                <Button 
                    aria-label='My Families' 
                    id="show-family-button" 
                    className="custom-button" 
                    size="lg" 
                    onClick={handleClick}
                >
                    My Families
                </Button>
                <Button 
                    arial-label='Create Family' 
                    id="create-family-button" 
                    className="custom-button" 
                    size="lg" 
                    onClick={() => setModalCreateFamilyShow(true)}
                >
                    Create Family
                </Button>
                <Button
                    arial-label='Join Family'
                    id="join-family-button"
                    className="custom-button"
                    size="lg"
                    onClick={() => setModalJoinFamilyShow(true)}
                >
                    Join Family
                </Button>
            </div>
            <Popup
                show={modalCreateFamilyShow}
                onHide={() => setModalCreateFamilyShow(false)}
                title="Create Family"
                body="Please input a new for the new family">
                <InputGroup className="mb-3">

                    <Form.Control
                        placeholder="Family Name"
                        aria-label="Family-Name"
                        aria-describedby="basic-addon1"
                        onChange={(event) => setFamilyName(event.target.value)}
                    />
                    <Button id="create-family-button" className="custom-button" onClick={handleClick}>Submit</Button>
                </InputGroup>
            </Popup>

            <Popup
                show={modalJoinFamilyShow}
                onHide={() => setModalJoinFamilyShow(false)}
                title="Join Family"
                body="Please input share code of the family">
                <InputGroup className="mb-3">

                    <Form.Control
                        placeholder="Family Share Code"
                        aria-label="Family-Sharecode"
                        aria-describedby="basic-addon1"
                        onChange={(event) => setFamilyCode(event.target.value)}
                    />
                    <Button id="join-family-button" className="custom-button" onClick={handleClick}>Submit</Button>
                </InputGroup>
            </Popup>
        </>
    );
}

export default Families;