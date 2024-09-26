import { useLocation } from "react-router-dom";
import { importRecipeFromUrl } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";
import { RecipeDetailsInterface } from "../../Api/apiInterface";

// export interface RecipeDetailsInterface {
//     name?: string;
//     images? :string[];
//     notes?: string;
//     description?: string;
//     recipeIngredients?: string[];
//     recipeInstructions?: string[];
//     uploadImage?: File;
// }

const NewRecipe: React.FC = () => {
    const location = useLocation();
    const url = location.state;
    const [data, setData] = useState<RecipeDetailsInterface>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: [],
        // uploadImage: undefined
    });

    const updateData = (newData: RecipeDetailsInterface) => {
        setData(newData);
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