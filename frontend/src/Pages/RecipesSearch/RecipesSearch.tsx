import { useLocation} from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { Row } from "react-bootstrap";
import { InfiniteList } from "../../Components/InfiniteList/InfiniteList";
import { searchRecipes } from "../../Api/api";

const RecipesSearch: React.FC = () => {
    const location = useLocation();
    const isFromMealForm = location.state?.isFromMealForm || false;

    return (
        <>
            <InfiniteList fetchItems={searchRecipes} renderItem=
                {
                    recipe => (
                        <Row className="mb-3" key={recipe.id}>
                            <RecipeCard recipe={recipe} isFromMealForm={isFromMealForm} />
                        </Row>
                    )
                } />
        </>
    );
}

export default RecipesSearch;