import { useLocation, useParams } from "react-router-dom";
import { getRecipeById, importRecipeFromUrl } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";

const RecipeCreation: React.FC = () => {
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
    const { recipeId } = useParams<{ recipeId: string }>();

    const updateData = (newData: RecipeDetailsInterface) => {
        setData(newData);
    }

    useEffect(() => {
        if (url !== null && url !== "") {
            importRecipeFromUrl(url)
                .then(response => {
                    if (response.status !== 200) {
                        throw new Error();
                    }
                    setData(response.data);
                })
                .catch((error) => { });
        }

        if (recipeId !== null) {
            const recipeIdNo = parseInt(recipeId!, 10);
            if (recipeIdNo > 0) {
                getRecipeById(recipeIdNo)
                    .then(recipe => setData(recipe.data))
                    .catch(err => {
                        console.error("Error getting recipe:", err);
                    });
            }
        }

    }, [url, recipeId]);

    return (
        <>
            <h1 className="mb-3">New Recipe</h1>
            <RecipeForm data={data} updateData={updateData} mode="add" />
        </>);
}

export default RecipeCreation;