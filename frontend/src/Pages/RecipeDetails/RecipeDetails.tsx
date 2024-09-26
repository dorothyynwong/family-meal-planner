import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeById } from "../../Api/api";
import { useEffect, useState } from "react";

export interface RecipeDetailsProps {
    id: number;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({id}) => {
    const [data, setData] = useState<RecipeDetailsInterface>();
   
    useEffect(()=>{
        getRecipeById(id)
        .then(recipeData => setData(recipeData.data));
    },[data])
    return (
        <>{data?.name}</>
    )

}

export default RecipeDetails;