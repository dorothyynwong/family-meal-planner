import { Button, Form } from "react-bootstrap";
import "./RecipeForm.scss"
import { addRecipe, updateRecipe } from "../../Api/api";
import RecipeSummaryForm from "./RecipeSummaryForm";
import RecipeIngredientForm from "./RecipeIngredientForm";
import RecipeInstructionForm from "./RecipeInstructionForm";
import RecipePhotoForm from "./RecipePhotoForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StatusHandler from "../StatusHandler/StatusHandler";

export interface RecipeFormProps {
    data: RecipeDetailsInterface;
    updateData: (newData: RecipeDetailsInterface) => void;
    mode: string;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ data, updateData, mode }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            setStatus("loading");
            setErrorMessages([]);
            if (mode === "add")
            {
                addRecipe(data)
                .then(response => {
                    if(response.status === 200)
                    {
                        const recipeData = response.data;
                        navigate(`/recipe-details/${recipeData}`);
                        setStatus("success");
                    }
                })
                .catch(error => {
                    console.log("Error adding recipe", error);
                    const errorMessage = error?.response?.data?.message || "Error adding recipe";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
                });
            }
            else
            {
                updateRecipe(data, data.id? data.id: 0)
                .then(response => {
                    if(response.status === 200)
                    {
                        navigate(`/recipe-details/${data.id}`);
                    }
                })
                .catch(error => {
                    console.log("Error updating recipe", error);
                    const errorMessage = error?.response?.data?.message || "Error updating recipe";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
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
            <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Submitting recipe ..."
                    successMessage="Recipe is submitted successfully!"
                >
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
            </StatusHandler>
        </Form>
    )

}

export default RecipeForm;