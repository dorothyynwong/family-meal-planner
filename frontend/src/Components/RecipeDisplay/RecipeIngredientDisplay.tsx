import { ListGroup } from "react-bootstrap";
import { RecipeDisplayProps } from "./RecipeDisplay";
import "./RecipeDisplay.scss";

const RecipeIngredientDisplay: React.FC<RecipeDisplayProps> = ({ data }) => {
    const ingredients = data?.recipeIngredients || [];

    return (
        <>
            <h5 className="mt-3">Ingredients</h5>
            <ListGroup as="ul" numbered>
                {Array.from({ length: ingredients.length }, (_, i) => (
                    <ListGroup.Item className="ingredient-item d-flex" as="li" key={`ingredient-${i}`}>
                        {ingredients && ingredients[i] ? ingredients[i] : ""}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )

}

export default RecipeIngredientDisplay;