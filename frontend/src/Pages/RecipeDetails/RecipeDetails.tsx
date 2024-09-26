
import { useParams } from "react-router-dom";
import RecipeDisplay from "../../Components/RecipeDisplay/RecipeDisplay";
import { useEffect, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeById } from "../../Api/api";


const RecipeDetails: React.FC = () => {
    const { id } = useParams<{ id: string  }>();
    const [recipeData, setRecipeData] = useState<RecipeDetailsInterface>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: [],
    });;
   
    useEffect(()=>{
        const recipeId = parseInt(id!, 10)
        getRecipeById(recipeId)
        .then(recipe => setRecipeData(recipe.data) );
    },[])

    return (
        <><RecipeDisplay data={recipeData} /></>
    )

}

export default RecipeDetails;