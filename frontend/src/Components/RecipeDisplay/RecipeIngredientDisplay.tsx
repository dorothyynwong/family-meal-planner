import { ListGroup } from "react-bootstrap";
import { RecipeDetailsProps } from "./RecipeDisplay";
import "./RecipeDisplay.scss";

const RecipeIngredientDisplay: React.FC<RecipeDetailsProps> = ({ data }) => {
    const ingredients = data?.recipeIngredients || [];

    return (
        <>
            <h5 className="mt-3">Ingredients</h5>
            <ListGroup as="ul" numbered>
                {Array.from({ length: ingredients.length }, (_, i) => (
                    <ListGroup.Item className="ingredient-item d-flex" as="li">
                        {ingredients && ingredients[i] ? ingredients[i] : ""}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )

}

export default RecipeIngredientDisplay;