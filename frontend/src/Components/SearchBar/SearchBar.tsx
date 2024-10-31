import { Form, InputGroup } from "react-bootstrap";
import { FaSearch } from 'react-icons/fa';
import "./SearchBar.scss";

interface SearchBarProps {
    searchValue: string;
    setSearchValue: (newValue:string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({searchValue, setSearchValue}) => {
    
    return (
        <>
            <InputGroup className="mb-3 search-container">
                <InputGroup.Text className="search-icon-box" id="basic-addon1">
                    <FaSearch className="search-icon" />
                </InputGroup.Text>

                <Form.Control
                    className="search-box"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </InputGroup>
        </>
    )
}

export default SearchBar;
