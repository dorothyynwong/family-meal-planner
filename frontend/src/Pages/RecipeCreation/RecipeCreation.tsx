import { useLocation } from "react-router-dom";
import { importRecipeFromUrl } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";

const RecipeCreation: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const location = useLocation();
    const url = location.state;
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
        if (url !== null && url !== "") {
            setStatus("loading");
            setErrorMessages([]);
            importRecipeFromUrl(url)
                .then(response => {
                    setData(response.data);
                    setStatus("success");
                })
                .catch(error => {
                    console.log("Error importing recipe", error);
                    const errorMessage = error?.response?.data?.message || "Error importing recipe";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
                });
        }

    }, [url]);

    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Importing Recipe ..."
                successMessage="Recipe is imported successfully!"
            >
                <></>
            </StatusHandler>
            <h1 className="mb-3">New Recipe</h1>
            <RecipeForm data={data} updateData={updateData} mode="add" />
        </>);
}

export default RecipeCreation;