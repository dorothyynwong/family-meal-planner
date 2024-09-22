import { useLocation } from "react-router-dom";
import { ImportRecipeFromUrl } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";

const NewRecipe: React.FC = () => {
    const location = useLocation();
    const url = location.state;
    const [data, setData] = useState();


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
                })
            .catch((error) => {});
        }
            
    }, [url]);

    return (
    <>
        <h1 className="mb-3">New Recipe</h1>
        <RecipeForm/>
    
    </>);
}

export default NewRecipe;