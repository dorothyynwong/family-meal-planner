import { Button, Form } from "react-bootstrap";
import "./RecipeForm.scss"
import { addRecipe } from "../../Api/api";
import RecipeSummaryForm from "./RecipeSummaryForm";
import RecipeIngredientForm from "./RecipeIngredientForm";
import RecipeInstructionForm from "./RecipeInstructionForm";
import RecipePhotoForm from "./RecipePhotoForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";

export interface RecipeFormProps {
    data: RecipeDetailsInterface;
    updateData: (newData: RecipeDetailsInterface) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ data, updateData }) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            addRecipe(data);
        }

    }

    return (
        <Form onSubmit={handleSubmit}>
            <RecipeSummaryForm data={data} updateData={updateData} />
            <RecipePhotoForm data={data} updateData={updateData} />
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