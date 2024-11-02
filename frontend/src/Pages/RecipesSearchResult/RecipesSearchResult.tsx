import { useLocation, useParams} from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { Row } from "react-bootstrap";
import { InfiniteList } from "../../Components/InfiniteList/InfiniteList";
import { searchRecipes } from "../../Api/api";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { useState } from "react";
import useDebounce from "../../Hooks/useDebounce";
// import { useMeal } from "../../Components/MealContext/MealContext";

const RecipesSearchResult: React.FC = () => {
    const location = useLocation();
    const isFromMealForm = location.state?.isFromMealForm || false;
    // const {recipeName} = useMeal();
    const {searchRecipeName} = useParams<{ searchRecipeName?: string }>();
    
    const [searchValue, setSearchValue] = useState(searchRecipeName || "");

    const debouncedSearchValue = useDebounce(searchValue, 1000);

    return (
        <>
            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
            <InfiniteList fetchItems={searchRecipes} 
                            renderItem={
                                            recipe => (
                                                <Row className="mb-3" key={recipe.id}>
                                                    <RecipeCard recipe={recipe} isFromMealForm={isFromMealForm} />
                                                </Row>
                                            )
                                        }
                            query={`RecipeName=${debouncedSearchValue}`}
            />
        </>
    );
}

export default RecipesSearchResult;