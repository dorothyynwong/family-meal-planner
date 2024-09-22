import { Form } from "react-bootstrap";
import RecipeSummary from "../RecipeSummary/RecipeSummary";
import RecipeIngredient from "../RecipeIngredient/RecipeIngredient";

const RecipeForm: React.FC = () => {
    return (
        <Form>
            <RecipeSummary />
            <RecipeIngredient/>
        </Form>
    )

}

export default RecipeForm;