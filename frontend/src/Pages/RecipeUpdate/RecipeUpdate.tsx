import { getRecipeById } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { useParams } from "react-router-dom";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";

const UpdateRecipe: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const { recipeId } = useParams<{ recipeId: string }>();
    const recipeIdNo = parseInt(recipeId!, 10);
    const [data, setData] = useState<RecipeDetailsInterface>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: [],
    });

    const updateData = (newData: RecipeDetailsInterface) => {
        setData(newData);
    }

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        getRecipeById(recipeIdNo)
            .then(response => {
                setData(response.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting recipe", error);
                const errorMessage = error?.response?.data?.message || "Error getting recipe";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });

    }, [recipeIdNo]);

    if (!data) return (<>No Data</>);

    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Getting recipe ..."
                successMessage="Recipe is retreived successfully!"
            >
                <></>
            </StatusHandler>
            <h1 className="mb-3">Update Recipe</h1>
            <RecipeForm data={data} updateData={updateData} mode="update" />
        </>);
}

export default UpdateRecipe;