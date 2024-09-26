import { Button, Form } from "react-bootstrap";
import RecipeSummary from "./RecipeSummary";
import RecipeIngredient from "./RecipeIngredient";
import "./RecipeForm.scss"
import RecipeInstruction from "./RecipeInstruction";
import { NewRecipeData } from "../../Pages/NewRecipe/NewRecipe";
import { addRecipe } from "../../Api/api";
import RecipePhotos from "./RecipePhotos";

export interface RecipeProps {
    data: NewRecipeData;
    updateData: (newData: NewRecipeData) => void;
}

const RecipeForm: React.FC<RecipeProps> = ({ data, updateData }) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            addRecipe(data);
        }

    }

    return (
        <Form onSubmit={handleSubmit}>
            <RecipeSummary data={data} updateData={updateData} />
            <RecipePhotos data={data} updateData={updateData} />
            <RecipeIngredient data={data} updateData={updateData} />
            <RecipeInstruction data={data} updateData={updateData} />
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )

}

export default RecipeForm;