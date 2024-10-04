import { useState } from "react";
import Popup from "../Popup/Popup";
import { Button, Form, InputGroup } from "react-bootstrap";

interface MealFormProps {
    modalShow: boolean;
    setModalShow: (newModalShow: boolean) => void;
}

const MealForm: React.FC<MealFormProps> = ({ modalShow, setModalShow }) => {
    const [mealName, setMealName] = useState("");

    const handleClick = () => {

    }

    return (
        <Popup
            show={modalShow}
            onHide={() => setModalShow(false)}
            title="Add New Meal"
            body="">
            <InputGroup className="mb-3">

                <Form.Control
                    className="meal-name"
                    placeholder="Meal Name"
                    aria-label="Meal-Name"
                    aria-describedby="basic-addon1"
                    onChange={(event) => setMealName(event.target.value)}
                />
                <Button id="add-meal-button" className="custom-button" onClick={handleClick}>Submit</Button>
            </InputGroup>
        </Popup>);
}

export default MealForm;