import { Button, Form, InputGroup } from "react-bootstrap";
import SearchBar from "../../Components/SearchBar/SearchBar";
import "./Recipes.scss";
import React, { useState } from "react";
import Popup from "../../Components/Popup/Popup";
import { useNavigate } from "react-router-dom";



const Recipes: React.FC = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState("");

    const handleClick = (event: { currentTarget: { id: string } })  => {
        const buttonId = event.currentTarget.id;
        switch (buttonId) {
          case "show-recipe-button":
            navigate("/recipes-list")
            break
          case "new-recipe-button":
            navigate("/recipe-add")
            break
          case "import-recipe-button":
            navigate("/recipe-add", { state: url })
            break
          case "log-out-button":
            navigate("/")
            break
          default:
            break
        }
    }

    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <h1>Recipes</h1>
            <SearchBar />
            <div className="button-box">
            <Button id="show-recipe-button" className="custom-button" size="lg" onClick={handleClick}>My Recipes</Button>
                <Button className="custom-button" size="lg" onClick={() => setModalShow(true)}>Import Recipe from Website</Button>
                <Button id="new-recipe-button" className="custom-button" size="lg" onClick={handleClick}>New Recipe</Button>
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
                    onChange={(event)=> setUrl(event.target.value)}
                />
                <Button id="import-recipe-button" className="custom-button" onClick={handleClick}>Submit</Button>
            </InputGroup>
            </Popup>
        </>
    );
}

export default Recipes;