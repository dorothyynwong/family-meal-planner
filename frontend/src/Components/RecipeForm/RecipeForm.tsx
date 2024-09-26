import { Button, Form } from "react-bootstrap";
import RecipeSummaryForm from "./RecipeSummaryForm";
import RecipeIngredientForm from "./RecipeIngredientForm";
import "./RecipeForm.scss"
import RecipeInstructionForm from "./RecipeInstructionForm";
import { NewRecipeData } from "../../Pages/NewRecipe/NewRecipe";
import { addRecipe } from "../../Api/api";
import RecipePhotos from "./RecipePhotosForm";

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
            <RecipeSummaryForm data={data} updateData={updateData} />
            <RecipePhotos data={data} updateData={updateData} />
            <RecipeIngredientForm data={data} updateData={updateData} />
            <RecipeInstructionForm data={data} updateData={updateData} />
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )

}

export default RecipeForm;