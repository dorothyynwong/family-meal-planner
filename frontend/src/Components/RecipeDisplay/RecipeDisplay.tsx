import { RecipeDetailsInterface } from "../../Api/apiInterface";
import RecipeSummaryDisplay from "./RecipeSummaryDisplay";
import RecipeIngredientDisplay from "./RecipeIngredientDisplay";
import RecipeCarousel from "../RecipeCarousel/RecipeCarousel";
import RecipeInstructionDisplay from "./RecipeInstructionDisplay";
import { Card } from "react-bootstrap";

export interface RecipeDisplayProps {
    data?: RecipeDetailsInterface
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ data }) => {
    if (!data) return (<>No Data</>);

    return (
        <>
            <h1 className="mb-3">{data.name}</h1>
            <Card className="vh-30">
                <RecipeCarousel images={data.images} />
            </Card>
            <RecipeSummaryDisplay data={data} />
            <RecipeIngredientDisplay data={data} />
            <RecipeInstructionDisplay data={data} />
        </>
    )

}

export default RecipeDisplay;