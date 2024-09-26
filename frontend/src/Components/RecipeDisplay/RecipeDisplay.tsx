import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeById } from "../../Api/api";
import { useEffect, useState } from "react";
import RecipeSummaryDisplay from "./RecipeSummaryDisplay";
import RecipeIngredientDisplay from "./RecipeIngredientDisplay";
import RecipeCarousel from "../RecipeCarousel/RecipeCarousel";
import RecipeInstructionDisplay from "./RecipeInstructionDisplay";
import { Card, Container, Row } from "react-bootstrap";


export interface RecipeDetailsProps {
    id: number;
    data?: RecipeDetailsInterface
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
            <h1 className="mb-3">{recipeData.name}</h1>
            <Card className="vh-30">
                <RecipeCarousel images={recipeData.images} />
            </Card>

            <RecipeSummaryDisplay id={id} data={recipeData} />  

        
        <RecipeIngredientDisplay id={id} data={recipeData} />
        <RecipeInstructionDisplay id={id} data={recipeData}  />
        </>
    )

}

export default RecipeDisplay;