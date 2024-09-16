import { Button } from "react-bootstrap";
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
            />
        </>
    );
}

export default Recipes;