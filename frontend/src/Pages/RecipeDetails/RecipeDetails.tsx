
import { useParams } from "react-router-dom";
import RecipeDisplay from "../../Components/RecipeDisplay/RecipeDisplay";


const RecipeDetails: React.FC = () => {
    const { id } = useParams<{ id: string  }>();
    return (
        <><RecipeDisplay id={parseInt(id!, 10)} /></>
    )

}

export default RecipeDetails;