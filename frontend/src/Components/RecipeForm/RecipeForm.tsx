import { Button, Form } from "react-bootstrap";
import RecipeSummary from "../RecipeSummary/RecipeSummary";
import RecipeIngredient from "../RecipeIngredient/RecipeIngredient";
import "./RecipeForm.scss"
import RecipeInstruction from "../RecipeInstruction/RecipeInstruction";

const RecipeForm: React.FC = () => {
    return (
        <Form>
            <RecipeSummary />
            <RecipeIngredient/>
            <RecipeInstruction />
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )

}

export default RecipeForm;