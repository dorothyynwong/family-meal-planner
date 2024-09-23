import { useLocation } from "react-router-dom";
import { ImportRecipeFromUrl } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";
import { ImportRecipeInterface } from "../../Api/apiInterface";

const NewRecipe: React.FC = () => {
    const location = useLocation();
    const url = location.state;
    const [data, setData] = useState<ImportRecipeInterface>();


    useEffect(() => {
        if (url!==null && url !== "")
        {
            ImportRecipeFromUrl(url)
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
        <RecipeForm/>
        {data?.recipeIngredients}
    </>);
}

export default NewRecipe;