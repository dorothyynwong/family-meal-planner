import { useLocation } from "react-router-dom";
import { ImportRecipeFromUrl } from "../../Api/api";
import { useEffect } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";

const NewRecipe: React.FC = () => {
    const location = useLocation();
    const url = location.state;

    useEffect(() => {
        if (url!==null && url !== "")
            ImportRecipeFromUrl(url);
    }, [url]);

    return (
    <>
        <h1 className="mb-3">New Recipe</h1>
        <RecipeForm />
    
    </>);
}

export default NewRecipe;