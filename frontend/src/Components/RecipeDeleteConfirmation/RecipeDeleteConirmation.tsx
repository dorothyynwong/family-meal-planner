
import { useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteRecipe} from "../../Api/api";
import Popup from "../../Components/Popup/Popup";
import { Button, InputGroup } from "react-bootstrap";
import { RecipeDetailsInterface } from "../../Api/apiInterface";

interface RecipeDeleteProps {
    data: RecipeDetailsInterface;
}

const RecipeDeleteConfirmation: React.FC<RecipeDeleteProps> = ({data}) => {
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(true);
    const [recipeData, setRecipeData] = useState<RecipeDetailsInterface>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: [],
    });;

    useEffect(() => {
        setRecipeData(data);
    }, [data])

    const handleClick = (event: { currentTarget: { id: string } }) => {
        const buttonId = event.currentTarget.id;
        switch (buttonId) {
            case "delete-recipe-button":
                deleteRecipe(recipeData.id? recipeData.id : 0);
                navigate("/recipes-list");
                break
            case "cancel-delete-recipe-button":
                setModalShow(false);
                break
            default:
                break
        }
    }

    return (
            <Popup
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={`Delete Recipe ${recipeData.name}`}
                body={`Are you sure to delete ${recipeData.name} ?`}>
                <InputGroup className="d-flex justify-content-evenly">
                    <Button id="delete-recipe-button" className="custom-button" onClick={handleClick}>Delete</Button>
                    <Button id="cancel-delete-recipe-button" className="custom-button" onClick={handleClick}>Cancel</Button>
                </InputGroup>
            </Popup>
    )
}

export default RecipeDeleteConfirmation;