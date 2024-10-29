
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteRecipe } from "../../Api/api";
import Popup from "../../Components/Popup/Popup";
import { Button, InputGroup } from "react-bootstrap";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";
import StatusHandler from "../StatusHandler/StatusHandler";

interface RecipeDeleteProps {
    data: RecipeDetailsInterface;
    onCancel: () => void;
}

const RecipeDeleteConfirmation: React.FC<RecipeDeleteProps> = ({ data, onCancel }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
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
                setStatus("loading");
                setErrorMessages([]);
                deleteRecipe(recipeData.id ? recipeData.id : 0)
                    .then(() => {
                        setModalShow(false);
                        navigate(`/recipes-list/`);
                        setStatus("success");
                    })
                    .catch(error => {
                        console.error("Error deleting recipe:", error);
                        const errorMessage = error?.response?.data?.message || "Error uploading image";
                        setStatus("error");
                        setErrorMessages([...errorMessages, errorMessage]);

                    });
                break
            case "cancel-delete-recipe-button":
                setModalShow(false);
                onCancel();
                break
            default:
                break
        }
    }

    return (
        <>
        {errorMessages && <ErrorDisplay errorMessages={errorMessages} />}
        <Popup
            show={modalShow}
            onHide={() => setModalShow(false)}
            title={`Delete Recipe ${recipeData.name}`}
            body={`Are you sure to delete ${recipeData.name} ?`}>
            <InputGroup className="d-flex justify-content-evenly">
            <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Deleting recipe..."
                    successMessage="Recipe is Deleted"
                >
                <Button id="delete-recipe-button" className="custom-button" onClick={handleClick}>Delete</Button>
            </StatusHandler>
                <Button id="cancel-delete-recipe-button" className="custom-button" onClick={handleClick}>Cancel</Button>
            </InputGroup>
        </Popup>
        </>
    )
}

export default RecipeDeleteConfirmation;