import { useLocation } from "react-router-dom";
import { ImportRecipeFromUrl } from "../../Api/api";
import { useEffect } from "react";

const NewRecipe: React.FC = () => {
    const location = useLocation();
    const url = location.state;

    useEffect(() => {
        if (url!==null && url !== "")
            ImportRecipeFromUrl(url);
    }, [url]);

    return (
    <>
        <h1>Create Recipe</h1>
    
    </>);
}

export default NewRecipe;