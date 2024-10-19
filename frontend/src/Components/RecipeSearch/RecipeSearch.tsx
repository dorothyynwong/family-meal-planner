import { InputGroup, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

interface RecipeSearchProps {
  recipeName: string;
  onSearchClick: () => void;
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({ recipeName, onSearchClick }) => (
  <InputGroup className="mt-3 recipe-search-container">
    <InputGroup.Text className="recipe-search-icon-box">
      <FaSearch className="recipe-search-icon" />
    </InputGroup.Text>
    <Form.Control
      className="recipe-search-box"
      placeholder="Search Recipe"
      aria-label="Search"
      onClick={onSearchClick}
      value={recipeName}
      readOnly
    />
  </InputGroup>
);

export default RecipeSearch;
