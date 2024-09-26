import { ListGroup } from "react-bootstrap";
import { RecipeDetailsProps } from "./RecipeDisplay";

const RecipeSummaryDisplay: React.FC<RecipeDetailsProps> = ({data}) => {
   
    return (
<ListGroup className="mb-3">
    <ListGroup.Item>
        <strong>Name:</strong> {data?.name}
    </ListGroup.Item>
    <ListGroup.Item>
        <strong>Description:</strong> {data?.description}
    </ListGroup.Item>
    <ListGroup.Item>
        <strong>Notes:</strong> {data?.notes}
    </ListGroup.Item>
</ListGroup>

    )

}

export default RecipeSummaryDisplay;