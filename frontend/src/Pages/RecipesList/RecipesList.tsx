import { useParams } from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { useEffect, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeByUserId } from "../../Api/api";
import { Row } from "react-bootstrap";

const RecipesList: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [recipesList, setRecipesList] = useState<RecipeDetailsInterface[]>([]);

    useEffect(() => {
        const userIdInt = parseInt(userId!, 10)
        getRecipeByUserId(userIdInt)
            .then(recipes => setRecipesList(recipes.data));
    }, [userId, recipesList])

    return (
        <>
            {recipesList.map((recipe, index) => (
                <Row className="mb-3" key={index}>
                    <RecipeCard recipe={recipe} />
                </Row>
            ))}

        </>
    );
}

export default RecipesList;