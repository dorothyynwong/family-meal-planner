import { useParams } from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { useEffect, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeByUserId } from "../../Api/api";

const RecipesList:React.FC = () => {
    const { userId } = useParams<{ userId: string  }>();
    const [recipesList, setRecipesList] = useState<RecipeDetailsInterface[]>([]);
   
    useEffect(()=>{
        const userIdInt = parseInt(userId!, 10)
        getRecipeByUserId(userIdInt)
        .then(recipes => setRecipesList(recipes.data));
    },[])

    return (
        <>
        {recipesList.map(recipe => (
            <RecipeCard recipe={recipe} />
        ))}
        
        </>
    );

}

export default RecipesList;