import { useLocation } from "react-router-dom";
import { importRecipeFromUrl } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";
import { ImportRecipeInterface } from "../../Api/apiInterface";

export interface NewRecipeData {
    name?: string;
    images? :string[];
    notes?: string;
    description?: string;
    recipeIngredients?: string[];
    recipeInstructions?: string[];
}

const NewRecipe: React.FC = () => {
    const location = useLocation();
    const url = location.state;
    const [data, setData] = useState<NewRecipeData>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: []
    });
    const updateData = (newData: NewRecipeData) => {
        setData(newData)
    }

    useEffect(() => {
        if (url!==null && url !== "")
        {
            importRecipeFromUrl(url)
            .then(response => 
                {
                    if(response.status !== 200) {
                        throw new Error();
                    }
                    setData(response.data);
                    console.log(response.data);
                })
            .catch((error) => {});
        }
            
    }, [url]);

    return (
    <>
        <h1 className="mb-3">New Recipe</h1>
        <RecipeForm data={data} updateData={updateData}  />
    </>);
}

export default NewRecipe;