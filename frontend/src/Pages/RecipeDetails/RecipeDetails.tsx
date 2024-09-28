
import { useNavigate, useParams } from "react-router-dom";
import RecipeDisplay from "../../Components/RecipeDisplay/RecipeDisplay";
import { useEffect, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { deleteRecipe, getRecipeById } from "../../Api/api";
import Popup from "../../Components/Popup/Popup";
import { Button, InputGroup } from "react-bootstrap";


const RecipeDetails: React.FC = () => {
    const { id, mode } = useParams<{ id: string, mode: string }>();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(mode==="delete"? true: false);
    const [recipeData, setRecipeData] = useState<RecipeDetailsInterface>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: [],
    });;

    useEffect(() => {
        const recipeId = parseInt(id!, 10)
        getRecipeById(recipeId)
            .then(recipe => setRecipeData(recipe.data));
    }, [])

    const handleClick = (event: { currentTarget: { id: string } }) => {
        const buttonId = event.currentTarget.id;
        switch (buttonId) {
            case "delete-recipe-button":
                const recipeId = parseInt(id!, 10);
                deleteRecipe(recipeId);
                navigate(-1);
                break
            case "cancel-delete-recipe-button":
                setModalShow(false);
                break
            default:
                break
        }
    }

    return (
        <>
            <RecipeDisplay data={recipeData} />
            {mode === "delete" &&
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
            }
        </>

    )

}

export default RecipeDetails;