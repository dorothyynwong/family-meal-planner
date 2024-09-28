import { Button, Form } from "react-bootstrap";
import "./RecipeForm.scss"
import { addRecipe, updateRecipe } from "../../Api/api";
import RecipeSummaryForm from "./RecipeSummaryForm";
import RecipeIngredientForm from "./RecipeIngredientForm";
import RecipeInstructionForm from "./RecipeInstructionForm";
import RecipePhotoForm from "./RecipePhotoForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { useNavigate } from "react-router-dom";

export interface RecipeFormProps {
    data: RecipeDetailsInterface;
    updateData: (newData: RecipeDetailsInterface) => void;
    mode: string;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ data, updateData, mode }) => {
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            if (mode === "add")
            {
                addRecipe(data)
                .then(response => {
                    if(response.statusText==="OK")
                    {
                        const recipeData = response.data;
                        navigate(`/recipe-details/${recipeData}`);
                    }
                });
            }
            else
            {
                updateRecipe(data, data.id? data.id: 0)
                .then(response => {
                    if(response.statusText==="OK")
                    {
                        navigate(`/recipe-details/${data.id}`);
                    }
                });
            }

        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <RecipeSummaryForm data={data} updateData={updateData} mode={mode} />
            <RecipePhotoForm data={data} updateData={updateData} mode={mode} />
            <RecipeIngredientForm data={data} updateData={updateData} mode={mode}/>
            <RecipeInstructionForm data={data} updateData={updateData} mode={mode} />
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )

}

export default RecipeForm;