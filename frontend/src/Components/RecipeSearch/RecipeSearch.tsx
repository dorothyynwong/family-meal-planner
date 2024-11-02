import { useEffect, useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMeal } from "../MealContext/MealContext";

interface RecipeSearchProps {
  isFromMealForm: boolean;
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({ isFromMealForm }) => {
  const {
    recipeName,
  } = useMeal();

  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setSearchValue(recipeName);
  }, [recipeName])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }

  return (
    <InputGroup className="mt-3 recipe-search-container">
      <InputGroup.Text className="recipe-search-icon-box">
        <FaSearch className="recipe-search-icon" />
      </InputGroup.Text>
      <Form.Control
        className="recipe-search-box"
        placeholder="Search Recipe"
        aria-label="Search"
        onChange={handleChange}
        value={searchValue}
      />
      <Button className="custom-button" onClick={() => navigate(`/recipes-search/${searchValue}`, { state: { isFromMealForm } })}>
        Search
      </Button>
    </InputGroup>
  );
}

export default RecipeSearch;
