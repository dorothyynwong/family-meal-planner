import { Button } from "react-bootstrap";
import SearchBar from "../../Components/SearchBar/SearchBar";
import "./Recipes.scss";

const Recipes: React.FC = () => {
    return (
        <>
            <h1>Recipes</h1>
            <SearchBar />
            <div className="button-box">
                <Button className="custom-button" size="lg">Import Recipe from Website</Button>
            </div>
        </>
    );
}

export default Recipes;