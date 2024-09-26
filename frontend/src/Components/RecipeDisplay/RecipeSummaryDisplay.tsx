import { ListGroup } from "react-bootstrap";
import { RecipeDetailsProps } from "./RecipeDisplay";
import { Form } from "react-router-dom";

const RecipeSummaryDisplay: React.FC<RecipeDetailsProps> = ({ data }) => {

    return (
        <>
            <h5 className="mt-3">Description</h5>
            {data?.description}
            <h5 className="mt-3">Notes</h5>
            {data?.notes}
        </>

    )

}

export default RecipeSummaryDisplay;