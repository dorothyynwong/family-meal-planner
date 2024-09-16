import { Button, Form, InputGroup } from "react-bootstrap";
import SearchBar from "../../Components/SearchBar/SearchBar";
import "./Recipes.scss";
import React from "react";
import Popup from "../../Components/Popup/Popup";

const Recipes: React.FC = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <h1>Recipes</h1>
            <SearchBar />
            <div className="button-box">
                <Button className="custom-button" size="lg" onClick={() => setModalShow(true)}>Import Recipe from Website</Button>
                <Button className="custom-button" size="lg">New Recipe</Button>
                <Button className="custom-button" size="lg">Copy from Recipe</Button>
            </div>
            <Popup
                show={modalShow}
                onHide={() => setModalShow(false)}
                title="Import Recipe from Website"
                body="Please input URL of a recipe">
                        <InputGroup className="mb-3">

                <Form.Control
                    className="url-input"
                    placeholder="Recipe Url"
                    aria-label="Recipe-Url"
                    aria-describedby="basic-addon1"
                />
                <Button className="custom-button">Submit</Button>
            </InputGroup>
            </Popup>
        </>
    );
}

export default Recipes;