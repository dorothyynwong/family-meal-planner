import { useEffect, useState } from "react";
import Popup from "../Popup/Popup";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { addMeal, deleteMeal, familyCodeShare, getMealTypes, updateMeal } from "../../Api/api";
import { FaSearch } from "react-icons/fa";
import { FamilyCodeShareInterface, MealDetailsInterface } from "../../Api/apiInterface";
import StatusHandler from "../StatusHandler/StatusHandler";
import "./FamilyCodeForm.scss";

interface FamilyCodeProps {
    modalShow: boolean,
    setModalShow: (newModalShow: boolean) => void;
    familyId: number,
    data?: FamilyCodeShareInterface
}

const FamilyCodeForm: React.FC<FamilyCodeProps> = ({ modalShow, setModalShow, familyId, data }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [familyCodeData, setFamilyCodeData] = useState<FamilyCodeShareInterface>(data ? data : {
        senderName: "",
        recipentName: "",
        recipentEmail: "",
    });;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFamilyCodeData({
            ...familyCodeData,
            [name]: value,
        })
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");
        setErrorMessages([]);

        familyCodeShare(familyCodeData)
            .then(response => {
                if (response.statusText === "OK") {
                    setModalShow(false);
                }
            })
            .catch(error => {
                console.log("Error sending share code", error);
                const errorMessage = error?.response?.data?.message || "Error sending share code";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }

    return (
        <Popup
            customclass="familyCode-form"
            show={modalShow}
            onHide={() => { setModalShow(false); }}
            title={`Share Family Code`}
            body="">
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    name="senderName"
                    className="mt-3 sender-name"
                    placeholder="Sender Name"
                    aria-label="Sender-Name"
                    aria-describedby="basic-addon1"
                    value={familyCodeData.senderName || ""}
                    onChange={handleChange}
                />

                <Form.Control
                    type="text"
                    name="recipentName"
                    className="mt-3 recipent-name"
                    placeholder="Recipent Name"
                    aria-label="Recipent-Name"
                    aria-describedby="basic-addon1"
                    value={familyCodeData.recipentName || ""}
                    onChange={handleChange}
                />

                <Form.Control
                    type="email"
                    name="recipentEmail"
                    className="mt-3 recipent-email"
                    placeholder="Recipent Email"
                    aria-label="Recipent-Email"
                    aria-describedby="basic-addon1"
                    value={familyCodeData.recipentEmail || ""}
                    onChange={handleChange}
                />


                <div className="d-flex justify-content-end">
                    <Button className="custom-button family-code-share-button" size="lg" type="submit">
                        Submit
                    </Button>
                </div>

                <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Sending Share Code ..."
                    successMessage=""
                >
                    <></>
                </StatusHandler>

            </Form>
        </Popup>);
}

export default FamilyCodeForm;