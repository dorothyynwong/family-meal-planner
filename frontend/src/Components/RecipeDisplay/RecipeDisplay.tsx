import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeById } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeSummaryDisplay from "./RecipeSummaryDisplay";
import RecipeIngredientDisplay from "./RecipeIngredientDisplay";
import RecipeCarousel from "../RecipeCarousel/RecipeCarousel";
import RecipeInstructionDisplay from "./RecipeInstructionDisplay";

export interface RecipeDetailsProps {
    id: number;
    // data?: RecipeDetailsInterface
}

const RecipeDisplay: React.FC<RecipeDetailsProps> = ({id}) => {
    const [recipeData, setRecipeData] = useState<RecipeDetailsInterface>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: [],
    });;
   
    useEffect(()=>{
        getRecipeById(id)
        .then(recipe => {setRecipeData(recipe.data); console.log(recipe.data); });
    },[])

    return (
        <>
        {recipeData.name}
        <RecipeCarousel images={recipeData.images} />
        <RecipeSummaryDisplay />
        <RecipeIngredientDisplay />
        <RecipeInstructionDisplay />
        </>
    )

}

export default RecipeDisplay;