import { Button, Form, InputGroup } from "react-bootstrap";
import SearchBar from "../../Components/SearchBar/SearchBar";
import "./Families.scss";
import React, { useState } from "react";
import Popup from "../../Components/Popup/Popup";
import { useNavigate } from "react-router-dom";



const Families: React.FC = () => {
    const navigate = useNavigate();
    const [familyCode, setFamilyCode] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [modalCreateFamilyShow, setModalCreateFamilyShow] = React.useState(false);
    const [modalJoinFamilyShow, setModalJoinFamilyShow] = React.useState(false);

    const handleClick = (event: { currentTarget: { id: string } })  => {
        const buttonId = event.currentTarget.id;
        switch (buttonId) {
          case "show-family-button":
            navigate(`/families-list`); 
            break
          case "create-family-button":
            navigate("/family-add", { state: familyName})
            break
          case "join-family-button":
            navigate("/family-join", { state: familyCode })
            break
          default:
            break
        }
    }

    return (
        <>
            <h1>My Families</h1>
            <div className="button-box">
            <Button id="show-family-button" className="custom-button" size="lg" onClick={handleClick}>My Families</Button>
                <Button id="create-family-button"className="custom-button" size="lg" onClick={() => setModalCreateFamilyShow(true)}>Create Family</Button>
                <Button id="join-family-button" className="custom-button" size="lg" onClick={() => setModalJoinFamilyShow(true)}>Join Family</Button>
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
                    onChange={(event)=> setFamilyName(event.target.value)}
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
                    onChange={(event)=> setFamilyCode(event.target.value)}
                />
                <Button id="join-family-button" className="custom-button" onClick={handleClick}>Submit</Button>
            </InputGroup>
            </Popup>
        </>
    );
}

export default Families;