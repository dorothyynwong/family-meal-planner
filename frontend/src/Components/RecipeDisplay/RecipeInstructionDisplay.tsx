import { ListGroup } from "react-bootstrap";
import { RecipeDisplayProps } from "./RecipeDisplay";
import "./RecipeDisplay.scss";

const RecipeInstructionDisplay: React.FC<RecipeDisplayProps> = ({ data }) => {
    const instructions = data?.recipeInstructions || [];

    return (
        <>
            <h5 className="mt-3">Instructions</h5>
            <ListGroup as="ol" numbered>
                {Array.from({ length: instructions.length }, (_, i) => (
                    <ListGroup.Item className="instruction-item d-flex" as="li" key={`instruction-${i}`}>
                        {instructions && instructions[i] ? instructions[i] : ""}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )

}

export default RecipeInstructionDisplay;