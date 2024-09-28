import { getRecipeById } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { useParams } from "react-router-dom";

const UpdateRecipe: React.FC = () => {
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
        getRecipeById(recipeIdNo)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error();
                }
                setData(response.data);
            })
            .catch(err => {
                console.error("Error getting recipe:", err);
            });

    }, [recipeIdNo]);

    if(!data) return(<>No Data</>);

    return (
        <>
            <h1 className="mb-3">Update Recipe</h1>
            <RecipeForm data={data} updateData={updateData} mode="update"/>
        </>);
}

export default UpdateRecipe;