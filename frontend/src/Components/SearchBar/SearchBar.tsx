import { Form, InputGroup } from "react-bootstrap";
import { FaSearch } from 'react-icons/fa';
import "./SearchBar.scss";

const SearchBar: React.FC = () => {
    return (
        <>
            <InputGroup className="mb-3">
                <InputGroup.Text className="search-box" id="basic-addon1">
                    <FaSearch className="search-icon" />
                </InputGroup.Text>

                <Form.Control
                    className="search-box"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
        </>
    )
}

export default SearchBar;
