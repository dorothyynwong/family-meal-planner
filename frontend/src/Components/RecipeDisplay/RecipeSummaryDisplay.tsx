import { RecipeDetailsProps } from "./RecipeDisplay";

const RecipeSummaryDisplay: React.FC<RecipeDetailsProps> = ({data}) => {
   
    return (
        <>{data?.name}</>
    )

}

export default RecipeSummaryDisplay;