import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeById } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeDisplay, { RecipeDetailsProps } from "../../Components/RecipeDisplay/RecipeDisplay";


const RecipeDetails: React.FC = () => {
    return (
        <><RecipeDisplay id={5} /></>
    )

}

export default RecipeDetails;