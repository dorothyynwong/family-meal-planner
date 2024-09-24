import { Button, Form } from "react-bootstrap";
import RecipeSummary from "../RecipeSummary/RecipeSummary";
import RecipeIngredient from "../RecipeIngredient/RecipeIngredient";
import "./RecipeForm.scss"
import RecipeInstruction from "../RecipeInstruction/RecipeInstruction";
import { NewRecipeData } from "../../Pages/NewRecipe/NewRecipe";
import { addRecipe } from "../../Api/api";

export interface NewRecipeProps {
    data: NewRecipeData;
    updateData: (newData: NewRecipeData) => void;
}

const RecipeForm: React.FC<NewRecipeProps> = ({ data, updateData }) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        if (data)
        {
            addRecipe(data);
            
        }
            
    }
    
    return (
        <Form onSubmit={handleSubmit}>
            <RecipeSummary data={data} updateData={updateData} />
            <RecipeIngredient data={data} updateData={updateData} />
            <RecipeInstruction data={data} updateData={updateData}  />
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )

}

export default RecipeForm;