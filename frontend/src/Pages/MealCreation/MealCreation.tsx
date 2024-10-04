import { useState } from "react";
import Popup from "../../Components/Popup/Popup";
import { Button, Form, InputGroup } from "react-bootstrap";

const MealCreation:React.FC = () => {
    const [modalShow, setModalShow] = useState(false);
    const [mealName, setMealName] = useState("");

    const handleClick = () => {

    }

    return(
        <Popup
        show={modalShow}
        onHide={() => setModalShow(false)}
        title="Import Recipe from Website"
        body="Please input URL of a recipe">
                <InputGroup className="mb-3">

        <Form.Control
            className="url-input"
            placeholder="Meal Name"
            aria-label="Meal-Name"
            aria-describedby="basic-addon1"
            onChange={(event)=> setMealName(event.target.value)}
        />
        <Button id="add-meal-button" className="custom-button" onClick={handleClick}>Submit</Button>
    </InputGroup>
    </Popup>);
}

export default MealCreation;