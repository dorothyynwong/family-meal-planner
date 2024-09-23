import { Button, Form } from "react-bootstrap";
import RecipeSummary from "../RecipeSummary/RecipeSummary";
import RecipeIngredient from "../RecipeIngredient/RecipeIngredient";
import "./RecipeForm.scss"
import RecipeInstruction from "../RecipeInstruction/RecipeInstruction";
import { ImportRecipeInterface } from "../../Api/apiInterface";

const RecipeForm: React.FC<ImportRecipeInterface> = (data) => {
    return (
        <Form>
            <RecipeSummary {...data}/>
            <RecipeIngredient {...data}/>
            <RecipeInstruction {...data} />
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )

}

export default RecipeForm;